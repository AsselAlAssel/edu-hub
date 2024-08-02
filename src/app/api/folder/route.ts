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
