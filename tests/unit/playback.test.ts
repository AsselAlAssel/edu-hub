// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, session, crumbs } = vi.hoisted(() => ({
	prisma: {
		video: { findUnique: vi.fn() },
		folder: { findUnique: vi.fn() },
		user: { findUnique: vi.fn() },
	},
	session: { current: null as null | { user: Record<string, unknown> } },
	crumbs: { current: [] as { id: string; name: string; price?: number }[] },
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({
	getServerSession: vi.fn(async () => session.current),
}));
vi.mock("@/libs/folder", () => ({
	getBreadcrumbs: vi.fn(async () => crumbs.current),
}));

import { GET } from "@/app/api/video/[id]/playback/route";

const KEY = "4742a81b-bf15-42fe-8b1c-8fcb9024c550";
const GUID = "32d140e2-e4f4-4eec-9d53-20371e9be607";
const VIDEO = "d".repeat(24);
const USER = "e".repeat(24);
const UNIT = "b".repeat(24);

const call = (id = VIDEO) =>
	GET(new Request("http://x") as never, {
		params: Promise.resolve({ id }),
	});
const signIn = (unlockedUnitIds: string[] = [], role = "USER") => {
	session.current = { user: { id: USER, email: "s@x.dev" } };
	prisma.user.findUnique.mockResolvedValue({
		id: USER,
		email: "s@x.dev",
		role,
		unlockedUnitIds,
	});
};

beforeEach(() => {
	session.current = null;
	vi.stubEnv("BUNNY_LIBRARY_ID", "759");
	vi.stubEnv("BUNNY_TOKEN_KEY", KEY);
	crumbs.current = [
		{ id: "a".repeat(24), name: "root" },
		{ id: UNIT, name: "الوحدة 1", price: 100 },
	];
	prisma.video.findUnique.mockResolvedValue({
		id: VIDEO,
		folderId: UNIT,
		url: `https://iframe.mediadelivery.net/embed/759/${GUID}`,
	});
});

describe("GET /api/video/[id]/playback", () => {
	it("400 for a malformed id", async () => {
		expect((await call("nope")).status).toBe(400);
	});

	it("401 for guests", async () => {
		expect((await call()).status).toBe(401);
	});

	it("404 for unknown or YouTube videos", async () => {
		signIn([UNIT]);
		prisma.video.findUnique.mockResolvedValueOnce(null);
		expect((await call()).status).toBe(404);
		prisma.video.findUnique.mockResolvedValueOnce({
			id: VIDEO,
			folderId: UNIT,
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		});
		expect((await call()).status).toBe(404);
	});

	it("403 without the unit", async () => {
		signIn([]);
		expect((await call()).status).toBe(403);
	});

	it("signs a short-lived URL for owners, with the watermark from the account", async () => {
		signIn([UNIT]);
		const res = await call();
		const body = await res.json();
		expect(res.status).toBe(200);
		expect(res.headers.get("Cache-Control")).toContain("no-store");
		expect(body.url).toContain(`/embed/759/${GUID}?token=`);
		expect(body.watermark).toBe("s@x.dev");
		expect(body.expires - Math.floor(Date.now() / 1000)).toBeLessThanOrEqual(
			300
		);
		expect(JSON.stringify(body)).not.toContain(KEY);
	});

	it("lets admins play without owning the unit", async () => {
		signIn([], "ADMIN");
		expect((await call()).status).toBe(200);
	});

	it("500 when Bunny is not configured", async () => {
		signIn([UNIT]);
		vi.stubEnv("BUNNY_TOKEN_KEY", "");
		expect((await call()).status).toBe(500);
	});
});
