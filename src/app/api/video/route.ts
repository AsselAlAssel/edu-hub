import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const { name, url, folderId, classId, videoId } = body;
	if (!name || !url || !folderId || !classId) {
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

	const classItem = await prisma.class.findUnique({
		where: {
			id: classId,
		},
	});
	if (!classItem) {
		return NextResponse.json(
			{
				message: "Class not found",
			},
			{ status: 404 }
		);
	}
	const folder = await prisma.folder.findUnique({
		where: {
			id: folderId,
		},
	});
	if (!folder) {
		return NextResponse.json(
			{
				message: "Folder not found",
			},
			{ status: 404 }
		);
	}

	await prisma.video.create({
		data: {
			name,
			url,
			folderId,
			classId,
			videoId,
			thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
		},
	});
	return new NextResponse(null, { status: 201 });
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
