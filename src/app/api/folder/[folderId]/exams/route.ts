import { getViewer } from "@/libs/access";
import { isObjectId, jsonError } from "@/libs/api";
import { getExamStatus } from "@/libs/examAccess";
import { summarizeAttempts } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ folderId: string }> };

/** The folder's exams, each with whether this viewer may take it. Admins also get the editable fields. */
export const GET = async (_req: Request, props: Props) => {
	const { folderId } = await props.params;
	if (!isObjectId(folderId)) return jsonError("Not Found", 404);

	const [viewer, exams] = await Promise.all([
		getViewer(),
		prisma.exam.findMany({
			where: { folderId },
			orderBy: { createdAt: "asc" },
		}),
	]);
	const isAdmin = viewer?.role === "ADMIN";
	// The viewer's own attempts, newest first: one query for the whole folder.
	let attempts: { examId: string; correct: number; total: number }[] = [];
	if (viewer)
		attempts = await prisma.examAttempt.findMany({
			where: { userId: viewer.id, examId: { in: exams.map((e) => e.id) } },
			select: { examId: true, correct: true, total: true },
			orderBy: { createdAt: "desc" },
		});
	return NextResponse.json(
		await Promise.all(
			exams.map(async (exam) => ({
				id: exam.id,
				title: exam.title,
				questionCount: exam.questionIds.length,
				unlockRule: exam.unlockRule,
				status: await getExamStatus(exam, viewer),
				results: summarizeAttempts(
					attempts.filter((a) => a.examId === exam.id)
				),
				...(isAdmin && { exam }),
			}))
		)
	);
};
