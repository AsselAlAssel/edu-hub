import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { parseQuestion } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SEARCH_LIMIT = 50;

/**
 * Admin: questions of one lesson (?lesson=), a text search (?q=) or specific
 * questions (?ids=a,b — returned in that order). Never the whole bank at once.
 */
export const GET = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const params = req.nextUrl.searchParams;
	const lesson = params.get("lesson");
	const q = params.get("q")?.trim();
	const ids = params.get("ids")?.split(",").filter(isObjectId);

	if (lesson)
		return NextResponse.json(
			await prisma.question.findMany({
				where: { lesson },
				orderBy: { id: "asc" },
			})
		);
	if (q)
		return NextResponse.json(
			await prisma.question.findMany({
				where: {
					OR: [
						{ text: { contains: q, mode: "insensitive" } },
						{ source: { contains: q, mode: "insensitive" } },
					],
				},
				orderBy: { id: "asc" },
				take: SEARCH_LIMIT,
			})
		);
	if (ids?.length) {
		const found = await prisma.question.findMany({
			where: { id: { in: ids } },
		});
		const byId = new Map(found.map((row) => [row.id, row]));
		return NextResponse.json(ids.flatMap((id) => byId.get(id) ?? []));
	}
	return jsonError("Missing Fields", 400);
};

export const POST = async (req: Request) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const parsed = parseQuestion(await readJson(req));
	if (!parsed.data) return jsonError(parsed.error, 400);
	return NextResponse.json(await prisma.question.create({ data: parsed.data }));
};
