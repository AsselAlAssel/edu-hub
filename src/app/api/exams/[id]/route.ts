import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { parseExam } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

export const PATCH = async (req: Request, props: Props) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	const parsed = parseExam(await readJson(req));
	if (!parsed.data) return jsonError(parsed.error, 400);
	if (!(await prisma.folder.count({ where: { id: parsed.data.folderId } })))
		return jsonError("المجلد غير موجود", 400);
	const { count } = await prisma.exam.updateMany({
		where: { id },
		data: parsed.data,
	});
	if (!count) return jsonError("Not Found", 404);
	return NextResponse.json({ id, ...parsed.data });
};

export const DELETE = async (_req: Request, props: Props) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	// Its attempts go with it.
	await prisma.$transaction([
		prisma.examAttempt.deleteMany({ where: { examId: id } }),
		prisma.exam.deleteMany({ where: { id } }),
	]);
	return NextResponse.json({ id });
};
