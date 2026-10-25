import { canOpenUnit, getUnit, getViewer } from "@/libs/access";
import { getSessionUser, isObjectId, jsonError } from "@/libs/api";
import { BUNNY_TOKEN_TTL_SECONDS, signBunnyEmbedUrl } from "@/libs/bunny";
import { parseBunnyUrl } from "@/libs/bunnyUrl";
import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Signed Bunny embed URL for a paid-unit video. The browser sends only the
 * video id; the video, its unit and the viewer's access all come from the DB.
 */
export const GET = async (
	_req: NextRequest,
	props: { params: Promise<{ id: string }> }
) => {
	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Invalid video id", 400);

	const [session, viewer] = await Promise.all([getSessionUser(), getViewer()]);
	if (!session || !viewer) return jsonError("Unauthorized", 401);

	const video = await prisma.video.findUnique({
		where: { id },
		select: { folderId: true, url: true },
	});
	const bunny = video && parseBunnyUrl(video.url);
	if (!video || !bunny) return jsonError("Video not found", 404);

	if (!canOpenUnit(viewer, await getUnit(video.folderId))) {
		return jsonError("Forbidden", 403);
	}

	const libraryId = process.env.BUNNY_LIBRARY_ID?.trim();
	const tokenKey = process.env.BUNNY_TOKEN_KEY?.trim();
	if (!libraryId || !tokenKey) {
		return jsonError("Bunny Stream is not configured", 500);
	}

	const expires = Math.floor(Date.now() / 1000) + BUNNY_TOKEN_TTL_SECONDS;
	const url = signBunnyEmbedUrl({
		libraryId,
		videoId: bunny.videoId,
		tokenKey,
		expires,
	});
	return NextResponse.json(
		{ url, expires, watermark: session.email ?? session.id },
		{ headers: { "Cache-Control": "private, no-store" } }
	);
};
