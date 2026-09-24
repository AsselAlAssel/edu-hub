import {
	cleanString,
	isObjectId,
	jsonError,
	readJson,
	requireAdmin,
} from "@/libs/api";
import { getClasses } from "@/libs/class";
import { prisma } from "@/libs/prismaDb";
import { recursiveDelete } from "@/libs/uitls";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const optionalString = (value: unknown, maxLength: number) =>
	typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 100);
	if (!name) return jsonError("Missing Fields", 400);

	const classItem = await prisma.class.create({
		data: {
			name,
			description: optionalString(body.description, 1000),
			image: optionalString(body.image, 2000),
		},
	});

	await prisma.folder.create({
		data: {
			name: "Root Folder",
			classId: classItem.id,
			isRoot: true,
		},
	});

	revalidatePath("/classes");
	return NextResponse.json(classItem, { status: 201 });
};

export const PUT = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const name = cleanString(body.name, 100);
	if (!isObjectId(body.id) || !name) return jsonError("Missing Fields", 400);

	const existing = await prisma.class.findUnique({ where: { id: body.id } });
	if (!existing) return jsonError("Class not found", 404);

	const updated = await prisma.class.update({
		where: { id: body.id },
		data: {
			name,
			image: optionalString(body.image, 2000),
		},
	});

	revalidatePath("/classes");
	return NextResponse.json(updated, { status: 200 });
};

export const DELETE = async (req: Request) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await readJson(req);
	if (!isObjectId(id)) return jsonError("Missing Fields", 400);

	const classItem = await prisma.class.findUnique({
		where: { id },
		include: { folders: { where: { isRoot: true } } },
	});

	const rootFolder = classItem?.folders[0];
	if (!classItem || !rootFolder) return jsonError("Class not found", 404);

	await recursiveDelete(rootFolder.id);
	await prisma.class.delete({ where: { id } });

	revalidatePath("/classes");
	return NextResponse.json({ success: true }, { status: 200 });
};

export const GET = async () => {
	const classes = await getClasses();
	return NextResponse.json(classes);
};
