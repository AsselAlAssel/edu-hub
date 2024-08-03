import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
	const body = await req.json();
	const { videoId } = body;
	if (!videoId) {
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

	const isFolderExist = await prisma.video.findUnique({
		where: {
			id: videoId,
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

	await prisma.video.delete({
		where: {
			id: videoId,
		},
	});

	return new NextResponse(null, { status: 204 });
};

export const PUT = async (req: NextRequest) => {
	const body = await req.json();
	const { videoId, name } = body;
	if (!videoId || !name) {
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

	const isFolderExist = await prisma.video.findUnique({
		where: {
			id: videoId,
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

	await prisma.video.update({
		where: {
			id: videoId,
		},
		data: {
			name,
		},
	});

	return new NextResponse(null, { status: 204 });
};
