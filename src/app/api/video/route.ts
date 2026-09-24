import {
	cleanString,
	isObjectId,
	jsonError,
	readJson,
	requireAdmin,
} from "@/libs/api";
import { getYouTubeVideoID } from "@/libs/constant";
import { getRankAfterLast } from "@/libs/lexorank";
import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 255);
	const url = cleanString(body.url, 500);
	const { folderId, classId } = body;

	if (!name || !url || !isObjectId(folderId) || !isObjectId(classId)) {
		return jsonError("Missing Fields", 400);
	}

	// Derive the id server-side instead of trusting the client-supplied one.
	const videoId = getYouTubeVideoID(url);
	if (!videoId) return jsonError("Invalid YouTube url", 400);

	const folder = await prisma.folder.findUnique({ where: { id: folderId } });
	if (!folder) return jsonError("Folder not found", 404);
	if (folder.classId !== classId) return jsonError("Class not found", 404);

	const lastVideo = await prisma.video.findFirst({
		where: { folderId },
		orderBy: { rank: "desc" },
		select: { rank: true },
	});

	const video = await prisma.video.create({
		data: {
			name,
			url,
			folderId,
			classId,
			videoId,
			thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
			rank: getRankAfterLast(lastVideo?.rank),
		},
	});
	return NextResponse.json(video, { status: 201 });
};

export const PUT = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 255);
	if (!isObjectId(body.videoId) || !name) {
		return jsonError("Missing Fields", 400);
	}

	const video = await prisma.video.findUnique({ where: { id: body.videoId } });
	if (!video) return jsonError("Video not found", 404);

	await prisma.video.update({ where: { id: body.videoId }, data: { name } });

	return new NextResponse(null, { status: 204 });
};

export const DELETE = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { videoId } = await readJson(req);
	if (!isObjectId(videoId)) return jsonError("Missing Fields", 400);

	const video = await prisma.video.findUnique({ where: { id: videoId } });
	if (!video) return jsonError("Video not found", 404);

	await prisma.video.delete({ where: { id: videoId } });

	return new NextResponse(null, { status: 204 });
};
