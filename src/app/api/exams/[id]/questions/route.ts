import { getViewer } from "@/libs/access";
import { isObjectId, jsonError } from "@/libs/api";
import { getExamQuestions, getExamStatus } from "@/libs/examAccess";
import { prisma } from "@/libs/prismaDb";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const MAX_LIMIT = 20;

type Props = { params: Promise<{ id: string }> };

/** A window of an exam's questions (?offset=&limit=, limit ≤ 20), without answers. */
export const GET = async (req: NextRequest, props: Props) => {
	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	const params = req.nextUrl.searchParams;
	const offset = Number(params.get("offset") ?? 0);
	const limit = Number(params.get("limit") ?? 10);
	if (
		!Number.isInteger(offset) ||
		!Number.isInteger(limit) ||
		offset < 0 ||
		limit < 1 ||
		limit > MAX_LIMIT
	)
		return jsonError("Bad Range", 400);

	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) return jsonError("Not Found", 404);
	const status = await getExamStatus(exam, await getViewer());
	if (status.state !== "open") return jsonError("Forbidden", 403);

	return NextResponse.json(
		await getExamQuestions(exam.questionIds, offset, limit)
	);
};
