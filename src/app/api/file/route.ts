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
import { deleteR2Object, r2KeyFromUrl } from "@/libs/r2";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 255);
	const url = cleanString(body.url, 2000);
	const type = cleanString(body.type, 20)?.toLowerCase();
	const { folderId, classId } = body;

	if (!name || !url || !type || !isObjectId(folderId) || !isObjectId(classId)) {
		return jsonError("Missing Fields", 400);
	}
	if (url !== "#" && !/^https:\/\//.test(url)) {
		return jsonError("Invalid file url", 400);
	}

	const folder = await prisma.folder.findUnique({ where: { id: folderId } });
	if (!folder) return jsonError("Folder not found", 404);
	if (folder.classId !== classId) return jsonError("Class not found", 404);

	const lastFile = await prisma.file.findFirst({
		where: { folderId },
		orderBy: { rank: "desc" },
		select: { rank: true },
	});

	const file = await prisma.file.create({
		data: {
			name,
			url,
			type,
			folderId,
			classId,
			rank: getRankAfterLast(lastFile?.rank),
		},
	});
	revalidateResourcePages();
	return NextResponse.json(file, { status: 201 });
};

export const DELETE = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { fileId } = await readJson(req);
	if (!isObjectId(fileId)) return jsonError("Missing Fields", 400);

	const file = await prisma.file.findUnique({ where: { id: fileId } });
	if (!file) return jsonError("File not found", 404);

	await prisma.file.delete({ where: { id: fileId } });

	const key = r2KeyFromUrl(file.url);
	if (key) await deleteR2Object(key);

	revalidateResourcePages();
	return new NextResponse(null, { status: 204 });
};

export const PUT = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 255);
	if (!isObjectId(body.fileId) || !name)
		return jsonError("Missing Fields", 400);

	const file = await prisma.file.findUnique({ where: { id: body.fileId } });
	if (!file) return jsonError("File not found", 404);

	await prisma.file.update({ where: { id: body.fileId }, data: { name } });

	revalidateResourcePages();
	return new NextResponse(null, { status: 204 });
};
