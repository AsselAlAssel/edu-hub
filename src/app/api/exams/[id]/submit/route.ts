import { getViewer } from "@/libs/access";
import { isObjectId, jsonError, readJson } from "@/libs/api";
import { getExamStatus } from "@/libs/examAccess";
import { gradeExam } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

/**
 * Grades { answers: { [questionId]: optionIndex } }, saves the score as an
 * attempt and returns it with the answer key, so the student can review.
 */
export const POST = async (req: Request, props: Props) => {
	const { id } = await props.params;
	if (!isObjectId(id)) return jsonError("Not Found", 404);
	const exam = await prisma.exam.findUnique({ where: { id } });
	if (!exam) return jsonError("Not Found", 404);
	const viewer = await getViewer();
	const status = await getExamStatus(exam, viewer);
	if (!viewer || status.state !== "open") return jsonError("Forbidden", 403);

	const { answers } = await readJson(req);
	if (!answers || typeof answers !== "object")
		return jsonError("Missing Fields", 400);
	const keys = await prisma.question.findMany({
		where: { id: { in: exam.questionIds } },
		select: { id: true, correctIndex: true },
	});
	const result = gradeExam(keys, answers);
	await prisma.examAttempt.create({
		data: {
			examId: exam.id,
			userId: viewer.id,
			correct: result.correct,
			total: result.total,
		},
	});
	return NextResponse.json(result);
};
