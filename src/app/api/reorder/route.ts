import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { getRankBetween } from "@/libs/lexorank";
import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

const RANK_TYPES = ["folder", "file", "video"] as const;
type RankType = (typeof RANK_TYPES)[number];

const optionalRank = (value: unknown) =>
	typeof value === "string" && value ? value : null;

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	const type = body.type as RankType;
	if (!RANK_TYPES.includes(type) || !isObjectId(body.id)) {
		return jsonError("Missing type or id", 400);
	}

	let newRank: string;
	try {
		newRank = getRankBetween(
			optionalRank(body.beforeRank),
			optionalRank(body.afterRank)
		);
	} catch {
		return jsonError("Invalid rank", 400);
	}

	try {
		const where = { id: body.id };
		const data = { rank: newRank };
		if (type === "folder") await prisma.folder.update({ where, data });
		else if (type === "file") await prisma.file.update({ where, data });
		else await prisma.video.update({ where, data });

		return NextResponse.json({ rank: newRank });
	} catch (error) {
		console.error("Reorder error:", error);
		return jsonError("Failed to reorder", 500);
	}
};
