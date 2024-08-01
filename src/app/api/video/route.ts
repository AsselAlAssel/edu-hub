// import { prisma } from "@/libs/prismaDb";
// import { isAdmin } from "@/libs/uitls";
// import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// export const POST = async (req: NextRequest) => {
// 	const body = await req.json();
// 	const { title, url, classId, folderId } = body;

// 	if (!title || !url) {
// 		return new Response("Missing Fields", { status: 400 });
// 	}
// 	if (!(await isAdmin())) {
// 		return new Response("Unauthorized", { status: 401 });
// 	}

// 	try {
// 		await prisma.video.create({
// 			data: {
// 				title,
// 				url,
// 				classId,
// 				folderId,
// 			},
// 		});
// 		return new Response("Video created", { status: 201 });
// 	} catch (error) {
// 		console.error(error);
// 		return new Response("Error creating video", { status: 500 });
// 	}
// };

// export const DELETE = async (req: NextRequest) => {
// 	const { searchParams } = new URL(req.url);
// 	const id = searchParams.get("id");

// 	if (!id) {
// 		return new Response("Missing Fields", { status: 400 });
// 	}
// 	if (!(await isAdmin())) {
// 		return new Response("Unauthorized", { status: 401 });
// 	}

// 	try {
// 		await prisma.video.delete({
// 			where: { id },
// 		});
// 		return new Response("Folder deleted", { status: 200 });
// 	} catch (error) {
// 		console.error(error);
// 		return new Response("something went wrong", { status: 500 });
// 	}
// };

// export const PUT = async (req: NextRequest) => {
// 	const body = await req.json();
// 	const { id, title, url } = body;

// 	if (!id || !title || !url) {
// 		return new Response("Missing Fields", { status: 400 });
// 	}
// 	if (!(await isAdmin())) {
// 		return new Response("Unauthorized", { status: 401 });
// 	}

// 	try {
// 		await prisma.video.update({
// 			where: { id },
// 			data: {
// 				title,
// 				url,
// 			},
// 		});
// 		return new Response("Video updated", { status: 200 });
// 	} catch (error) {
// 		console.error(error);
// 		return new Response("something went wrong", { status: 500 });
// 	}
// };

export const POST = async () => {
	return NextResponse.json({ message: "POST /api/video" });
};
