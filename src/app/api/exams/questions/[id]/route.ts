import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { parseQuestion } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import { deleteR2Object, r2KeyFromUrl } from "@/libs/r2";
import { NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

/** Drops a drawing from storage once no question points at it. */
const removeImage = async (url: string | null | undefined) => {
	const key = url && r2KeyFromUrl(url);
	if (key) await deleteR2Object(key);
};

export const PATCH = async (req: Request, props: Props) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	const parsed = parseQuestion(await readJson(req));
	if (!parsed.data) return jsonError(parsed.error, 400);

	const before = await prisma.question.findUnique({
		where: { id },
		select: { image: true },
	});
	if (!before) return jsonError("Not Found", 404);
	const question = await prisma.question.update({
		where: { id },
		data: parsed.data,
	});
	if (before.image !== question.image) await removeImage(before.image);
	return NextResponse.json(question);
};

/** Deletes the question, its drawing, and drops it from every exam that used it. */
export const DELETE = async (_req: Request, props: Props) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	const question = await prisma.question.findUnique({
		where: { id },
		select: { image: true },
	});
	if (!question) return jsonError("Not Found", 404);

	const exams = await prisma.exam.findMany({
		where: { questionIds: { has: id } },
		select: { id: true, questionIds: true },
	});
	await prisma.$transaction([
		...exams.map((exam) =>
			prisma.exam.update({
				where: { id: exam.id },
				data: { questionIds: exam.questionIds.filter((q) => q !== id) },
			})
		),
		prisma.question.delete({ where: { id } }),
	]);
	await removeImage(question.image);
	return NextResponse.json({ id });
};
