import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { getRankAfterLast } from "@/libs/lexorank";
import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

/** Moves a file or video into another folder of the same class (appended last). */
export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { type, id, targetFolderId } = await readJson(req);

	if (
		(type !== "file" && type !== "video") ||
		!isObjectId(id) ||
		!isObjectId(targetFolderId)
	) {
		return jsonError("Missing fields", 400);
	}

	const folder = await prisma.folder.findUnique({
		where: { id: targetFolderId },
	});
	if (!folder) return jsonError("Target folder not found", 404);

	try {
		if (type === "file") {
			const item = await prisma.file.findUnique({ where: { id } });
			if (!item) return jsonError("File not found", 404);
			if (item.classId !== folder.classId) {
				return jsonError("Cannot move between classes", 400);
			}
			const last = await prisma.file.findFirst({
				where: { folderId: targetFolderId },
				orderBy: { rank: "desc" },
				select: { rank: true },
			});
			await prisma.file.update({
				where: { id },
				data: { folderId: targetFolderId, rank: getRankAfterLast(last?.rank) },
			});
		} else {
			const item = await prisma.video.findUnique({ where: { id } });
			if (!item) return jsonError("Video not found", 404);
			if (item.classId !== folder.classId) {
				return jsonError("Cannot move between classes", 400);
			}
			const last = await prisma.video.findFirst({
				where: { folderId: targetFolderId },
				orderBy: { rank: "desc" },
				select: { rank: true },
			});
			await prisma.video.update({
				where: { id },
				data: { folderId: targetFolderId, rank: getRankAfterLast(last?.rank) },
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Move error:", error);
		return jsonError("Failed to move", 500);
	}
};
