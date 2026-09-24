import { revalidateResourcePages } from "@/libs/revalidate";
import {
	cleanString,
	isObjectId,
	jsonError,
	readJson,
	requireAdmin,
} from "@/libs/api";
import { getRankAfterLast } from "@/libs/lexorank";
import { prisma } from "@/libs/prismaDb";
import { recursiveDelete } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 120);
	const { classId, parentFolderId } = body;
	if (!name || !isObjectId(classId) || !isObjectId(parentFolderId)) {
		return jsonError("Missing Fields", 400);
	}

	const parentFolder = await prisma.folder.findUnique({
		where: { id: parentFolderId },
	});
	if (!parentFolder) return jsonError("Parent Folder not found", 404);
	if (parentFolder.classId !== classId) {
		return jsonError("Class not found", 404);
	}

	const lastFolder = await prisma.folder.findFirst({
		where: { parentFolderId },
		orderBy: { rank: "desc" },
		select: { rank: true },
	});

	const folder = await prisma.folder.create({
		data: {
			name,
			classId,
			parentFolderId,
			rank: getRankAfterLast(lastFolder?.rank),
		},
	});

	revalidateResourcePages();
	return NextResponse.json(folder, { status: 201 });
};

/**
 * Rename a folder. Accepts `folderId`; the legacy client sent the folder being
 * renamed as `parentFolderId`, which is still honoured for compatibility.
 */
export const PUT = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 120);
	const folderId = body.folderId ?? body.parentFolderId;
	if (!name || !isObjectId(folderId)) return jsonError("Missing Fields", 400);

	const existing = await prisma.folder.findUnique({ where: { id: folderId } });
	if (!existing) return jsonError("Folder not found", 404);
	if (existing.isRoot) return jsonError("Root folder cannot be renamed", 400);

	const folder = await prisma.folder.update({
		where: { id: folderId },
		data: { name },
	});

	revalidateResourcePages();
	return NextResponse.json(folder, { status: 200 });
};

export const DELETE = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { folderId } = await readJson(req);
	if (!isObjectId(folderId)) return jsonError("Missing Fields", 400);

	const folder = await prisma.folder.findUnique({ where: { id: folderId } });
	if (!folder) return jsonError("Folder not found", 404);
	if (folder.isRoot) return jsonError("Root folder cannot be deleted", 400);

	await recursiveDelete(folderId);

	revalidateResourcePages();
	return new NextResponse(null, { status: 204 });
};
