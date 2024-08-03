import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
	const body = await req.json();
	const { fileId } = body;
	if (!fileId) {
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

	const isFolderExist = await prisma.file.findUnique({
		where: {
			id: fileId,
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

	await prisma.file.delete({
		where: {
			id: fileId,
		},
	});

	return new NextResponse(null, { status: 204 });
};

export const PUT = async (req: NextRequest) => {
	const body = await req.json();
	const { fileId, name } = body;
	if (!fileId || !name) {
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

	const isFolderExist = await prisma.file.findUnique({
		where: {
			id: fileId,
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

	await prisma.file.update({
		where: {
			id: fileId,
		},
		data: {
			name,
		},
	});

	return new NextResponse(null, { status: 204 });
};
