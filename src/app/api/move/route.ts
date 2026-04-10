import { prisma } from "@/libs/prismaDb";
import { getRankAfterLast } from "@/libs/lexorank";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const { type, id, targetFolderId } = body as {
		type: "file" | "video";
		id: string;
		targetFolderId: string;
	};

	if (!type || !id || !targetFolderId) {
		return NextResponse.json({ message: "Missing fields" }, { status: 400 });
	}

	const folder = await prisma.folder.findUnique({
		where: { id: targetFolderId },
	});
	if (!folder) {
		return NextResponse.json(
			{ message: "Target folder not found" },
			{ status: 404 }
		);
	}

	try {
		if (type === "file") {
			const lastFile = await prisma.file.findFirst({
				where: { folderId: targetFolderId },
				orderBy: { rank: "desc" },
				select: { rank: true },
			});

			await prisma.file.update({
				where: { id },
				data: {
					folderId: targetFolderId,
					rank: getRankAfterLast(lastFile?.rank),
				},
			});
		} else if (type === "video") {
			const lastVideo = await prisma.video.findFirst({
				where: { folderId: targetFolderId },
				orderBy: { rank: "desc" },
				select: { rank: true },
			});

			await prisma.video.update({
				where: { id },
				data: {
					folderId: targetFolderId,
					rank: getRankAfterLast(lastVideo?.rank),
				},
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Move error:", error);
		return NextResponse.json({ message: "Failed to move" }, { status: 500 });
	}
};
