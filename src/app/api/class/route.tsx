import { prisma } from "@/libs/prismaDb";
import { isAdmin, recursiveDelete } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const { name, description } = body;

	if (!name) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classItem = await prisma.class.create({
		data: {
			name,
			description: description || "",
		},
	});

	await prisma.folder.create({
		data: {
			name: "Root Folder",
			classId: classItem.id,
			isRoot: true,
		},
	});

	return new NextResponse("Class created", { status: 201 });
};

export const PUT = async (req: NextRequest) => {
	const body = await req.json();
	const { id, name } = body;

	if (!id || !name) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	await prisma.class.update({
		where: {
			id,
		},
		data: {
			name,
		},
	});

	return new NextResponse("Class updated", { status: 200 });
};

export const DELETE = async (req: Request) => {
	const body = await req.json();
	const { id } = body;

	if (!id) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classItem = await prisma.class.findUnique({
		where: { id },
		include: {
			folders: {
				where: { isRoot: true },
			},
		},
	});

	if (!classItem) {
		return new NextResponse("Class not found", { status: 404 });
	}

	const rootFolder = classItem.folders[0];

	if (!rootFolder) {
		return new NextResponse("Class not found", { status: 404 });
	}

	await recursiveDelete(rootFolder.id);

	await prisma.class.delete({ where: { id } });

	return new NextResponse("Class deleted", { status: 200 });
};
