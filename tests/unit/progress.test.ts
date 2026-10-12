// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, session } = vi.hoisted(() => ({
	prisma: {
		videoProgress: { findMany: vi.fn(), upsert: vi.fn() },
		video: { findMany: vi.fn(), findUnique: vi.fn() },
	},
	session: { current: null as null | { user: Record<string, unknown> } },
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({
	getServerSession: vi.fn(async () => session.current),
}));
vi.mock("next-auth/react", () => ({ useSession: () => ({ data: null }) }));

import { GET, POST } from "@/app/api/progress/route";
import {
	completedIn,
	formatTime,
	inProgress,
	isWatched,
	playedDelta,
	resumeAt,
	watchUrl,
} from "@/hooks/useProgress";

const USER_ID = "b".repeat(24);
const VIDEO_ID = "d".repeat(24);
const post = (body: unknown) =>
	POST(
		new Request("http://localhost/api/progress", {
			method: "POST",
			body: JSON.stringify(body),
		})
	);

beforeEach(() => {
	vi.clearAllMocks();
	session.current = { user: { id: USER_ID, role: "USER" } };
	prisma.videoProgress.upsert.mockResolvedValue({});
	prisma.video.findUnique.mockResolvedValue({ id: VIDEO_ID });
});

describe("watch logic", () => {
	it("counts normal playback and ignores seeks", () => {
		expect(playedDelta(10, 11)).toBe(1);
		expect(playedDelta(10, 12)).toBe(2); // 2x speed
		expect(playedDelta(10, 300)).toBe(0); // seek forward
		expect(playedDelta(300, 10)).toBe(0); // seek back
		expect(playedDelta(10, 10)).toBe(0); // paused
	});

	it("is watched at 90% of the duration", () => {
		expect(isWatched(89, 100)).toBe(false);
		expect(isWatched(90, 100)).toBe(true);
		expect(isWatched(50, 0)).toBe(false); // duration unknown
	});

	it("resumes from the start once (nearly) finished", () => {
		expect(resumeAt(120, 600)).toBe(120);
		expect(resumeAt(595, 600)).toBe(0);
		expect(resumeAt(120, 0)).toBe(120);
	});

	it("formats time", () => {
		expect(formatTime(5)).toBe("0:05");
		expect(formatTime(185.7)).toBe("3:05");
		expect(formatTime(3729)).toBe("1:02:09");
	});
});

describe("progress views", () => {
	const item = (over: Record<string, unknown>) => ({
		videoId: "v",
		position: 0,
		watched: 0,
		completed: false,
		classId: "c1",
		folderId: "f1",
		...over,
	});

	it("resume list: started, unfinished, newest first", () => {
		const list = inProgress([
			item({ videoId: "old", position: 30, updatedAt: "2026-10-01" }),
			item({ videoId: "done", position: 30, completed: true }),
			item({ videoId: "unstarted", position: 0 }),
			item({ videoId: "new", position: 5, updatedAt: "2026-10-12" }),
		]);
		expect(list.map((x) => x.videoId)).toEqual(["new", "old"]);
	});

	it("counts finished videos per class", () => {
		const items = [
			item({ completed: true }),
			item({ completed: true, classId: "c2" }),
			item({ completed: false }),
		];
		expect(completedIn(items, "c1")).toBe(1);
		expect(completedIn(items, "c2")).toBe(1);
	});

	it("links straight to the video in its folder", () => {
		expect(watchUrl(item({ videoId: "v9" }))).toBe("/class/c1/folder/f1?v=v9");
	});
});

describe("/api/progress", () => {
	it("rejects guests", async () => {
		session.current = null;
		expect((await GET()).status).toBe(401);
		expect((await post({ videoId: VIDEO_ID, completed: true })).status).toBe(
			401
		);
	});

	it("reads the caller's own progress, tagged by class, minus deleted videos", async () => {
		const GONE_ID = "e".repeat(24);
		prisma.videoProgress.findMany.mockResolvedValue([
			{ videoId: VIDEO_ID, position: 0, watched: 0, completed: true },
			{ videoId: GONE_ID, position: 0, watched: 0, completed: true },
		]);
		prisma.video.findMany.mockResolvedValue([
			{
				id: VIDEO_ID,
				classId: "c1",
				folderId: "f1",
				name: "قانون فاراداي",
				videoId: "yt1",
			},
		]);
		const res = await GET();
		expect(prisma.videoProgress.findMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: { userId: USER_ID } })
		);
		expect(await res.json()).toEqual([
			{
				videoId: VIDEO_ID,
				position: 0,
				watched: 0,
				completed: true,
				classId: "c1",
				folderId: "f1",
				name: "قانون فاراداي",
				youtubeId: "yt1",
			},
		]);
	});

	it("validates input", async () => {
		expect((await post({ videoId: "x", completed: true })).status).toBe(400);
		expect((await post({ videoId: VIDEO_ID })).status).toBe(400);
		expect(
			(await post({ videoId: VIDEO_ID, position: -5, completed: "yes" })).status
		).toBe(400);
		expect(prisma.videoProgress.upsert).not.toHaveBeenCalled();
	});

	it("rejects ids of videos that don't exist", async () => {
		prisma.video.findUnique.mockResolvedValue(null);
		expect((await post({ videoId: VIDEO_ID, completed: true })).status).toBe(
			404
		);
		expect(prisma.videoProgress.upsert).not.toHaveBeenCalled();
	});

	it("upserts only the provided fields for the caller", async () => {
		expect((await post({ videoId: VIDEO_ID, position: 42.5 })).status).toBe(
			200
		);
		const where = { userId_videoId: { userId: USER_ID, videoId: VIDEO_ID } };
		expect(prisma.videoProgress.upsert).toHaveBeenCalledWith(
			expect.objectContaining({
				where,
				update: { position: 42.5, watched: undefined, completed: undefined },
			})
		);
	});
});
