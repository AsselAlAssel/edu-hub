import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const { name, classId, parentFolderId } = body;
	if (!name || !classId || !parentFolderId) {
		return NextResponse.json(
			{
				message: "Missing Fields",
			},
			{ status: 400 }
		);
	}
	if (!(await isAdmin())) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}

	const isClassExist = await prisma.class.findUnique({
		where: {
			id: classId,
		},
	});
	if (!isClassExist) {
		return NextResponse.json(
			{
				message: "Class not found",
			},
			{ status: 404 }
		);
	}
	const isParentFolderExist = await prisma.folder.findUnique({
		where: {
			id: parentFolderId,
		},
	});
	if (!isParentFolderExist) {
		return NextResponse.json(
			{
				message: "Parent Folder not found",
			},
			{ status: 404 }
		);
	}

	const folder = await prisma.folder.create({
		data: {
			name,
			classId,
			parentFolderId,
		},
	});

	return new NextResponse(JSON.stringify(folder), { status: 201 });
};

// edit folder name
export const PUT = async (req: NextRequest) => {
	const body = await req.json();
	const { name, classId, parentFolderId } = body;
	if (!name || !classId || !parentFolderId) {
		return NextResponse.json(
			{
				message: "Missing Fields",
			},
			{ status: 400 }
		);
	}
	if (!(await isAdmin())) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}

	const isClassExist = await prisma.class.findUnique({
		where: {
			id: classId,
		},
	});
	if (!isClassExist) {
		return NextResponse.json(
			{
				message: "Class not found",
			},
			{ status: 404 }
		);
	}
	const isParentFolderExist = await prisma.folder.findUnique({
		where: {
			id: parentFolderId,
		},
	});
	if (!isParentFolderExist) {
		return NextResponse.json(
			{
				message: "Parent Folder not found",
			},
			{ status: 404 }
		);
	}

	const folder = await prisma.folder.update({
		where: {
			id: parentFolderId,
		},
		data: {
			name,
		},
	});

	return new NextResponse(JSON.stringify(folder), { status: 200 });
};

// delete folder
export const DELETE = async (req: NextRequest) => {
	const body = await req.json();
	const { folderId } = body;
	if (!folderId) {
		return NextResponse.json(
			{
				message: "Missing Fields",
			},
			{ status: 400 }
		);
	}
	if (!(await isAdmin())) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}

	const isFolderExist = await prisma.folder.findUnique({
		where: {
			id: folderId,
		},
	});
	if (!isFolderExist) {
		return NextResponse.json(
			{
				message: "Folder not found",
			},
			{ status: 404 }
		);
	}

	await prisma.folder.delete({
		where: {
			id: folderId,
		},
	});

	return new NextResponse(null, { status: 204 });
};
