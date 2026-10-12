import { getSessionUser, isObjectId, jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

const progressSelect = {
	videoId: true,
	position: true,
	watched: true,
	completed: true,
} as const;

const seconds = (value: unknown) =>
	typeof value === "number" && Number.isFinite(value) && value >= 0
		? value
		: undefined;

/**
 * The signed-in student's progress on every video they've opened, with each
 * video's classId (for per-class totals). Deleted videos are left out.
 */
export const GET = async () => {
	const user = await getSessionUser();
	if (!user) return jsonError("Unauthorized", 401);

	const progress = await prisma.videoProgress.findMany({
		where: { userId: user.id },
		select: progressSelect,
	});
	const videos = await prisma.video.findMany({
		where: { id: { in: progress.map((item) => item.videoId) } },
		select: { id: true, classId: true },
	});
	const classOf = new Map(videos.map((video) => [video.id, video.classId]));
	return NextResponse.json(
		progress
			.filter((item) => classOf.has(item.videoId))
			.map((item) => ({ ...item, classId: classOf.get(item.videoId) }))
	);
};

/** Saves position/watched time and/or completion for one video. */
export const POST = async (req: Request) => {
	const user = await getSessionUser();
	if (!user) return jsonError("Unauthorized", 401);

	const body = await readJson(req);
	if (!isObjectId(body.videoId)) return jsonError("Invalid video", 400);

	const data = {
		position: seconds(body.position),
		watched: seconds(body.watched),
		completed: typeof body.completed === "boolean" ? body.completed : undefined,
	};
	if (Object.values(data).every((value) => value === undefined)) {
		return jsonError("Nothing to save", 400);
	}
	// Real videos only, so a student can't fill the DB with made-up ids.
	if (!(await prisma.video.findUnique({ where: { id: body.videoId } }))) {
		return jsonError("Video not found", 404);
	}

	const progress = await prisma.videoProgress.upsert({
		where: { userId_videoId: { userId: user.id, videoId: body.videoId } },
		create: { userId: user.id, videoId: body.videoId, ...data },
		update: data,
		select: progressSelect,
	});
	return NextResponse.json(progress);
};
