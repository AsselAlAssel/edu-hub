import { createFolder, createVideoCollection } from "@/libs/bunny";
import { getClasses } from "@/libs/class";
import { prisma } from "@/libs/prismaDb";
import { isAdmin, isUser } from "@/libs/uitls";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
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
	const uniqueNameForFolder = name + classItem.id;
	await createFolder(uniqueNameForFolder, "");
	const collection = await createVideoCollection(name);

	await prisma.folder.create({
		data: {
			name: "Root Folder",
			classId: classItem.id,
			isRoot: true,
			bunnyStorageFolderBath: `${encodeURIComponent(uniqueNameForFolder)}/`,
			bunnyStorageFolderName: encodeURIComponent(uniqueNameForFolder),
			bunnyVideoCollectionId: collection.guid,
		},
	});

	return new NextResponse("Class created", { status: 201 });
};

export const GET = async () => {
	if (!(await isUser())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classes = await getClasses();

	return NextResponse.json(classes);
};

export const PUT = async (req: Request) => {
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

export const recursiveDelete = async (folderId: string) => {
	const folders = await prisma.folder.findMany({
		where: { parentFolderId: folderId },
	});

	if (folders.length === 0) {
		await prisma.file.deleteMany({ where: { folderId } });
		await prisma.video.deleteMany({ where: { folderId } });
		await prisma.folder.delete({ where: { id: folderId } });
		return;
	}

	await Promise.all(
		folders.map(async (folder) => {
			await recursiveDelete(folder.id);
		})
	);

	await prisma.file.deleteMany({ where: { folderId } });
	await prisma.video.deleteMany({ where: { folderId } });
	await prisma.folder.delete({ where: { id: folderId } });
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
