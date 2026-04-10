import { prisma } from "@/libs/prismaDb";
import { getRankBetween } from "@/libs/lexorank";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	if (!(await isAdmin())) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const body = await req.json();
	const { type, id, beforeRank, afterRank } = body as {
		type: "folder" | "file" | "video";
		id: string;
		beforeRank?: string | null;
		afterRank?: string | null;
	};

	if (!type || !id) {
		return NextResponse.json(
			{ message: "Missing type or id" },
			{ status: 400 }
		);
	}

	const newRank = getRankBetween(beforeRank, afterRank);

	try {
		if (type === "folder") {
			await prisma.folder.update({
				where: { id },
				data: { rank: newRank },
			});
		} else if (type === "file") {
			await prisma.file.update({
				where: { id },
				data: { rank: newRank },
			});
		} else if (type === "video") {
			await prisma.video.update({
				where: { id },
				data: { rank: newRank },
			});
		}

		return NextResponse.json({ rank: newRank });
	} catch (error) {
		console.error("Reorder error:", error);
		return NextResponse.json({ message: "Failed to reorder" }, { status: 500 });
	}
};
