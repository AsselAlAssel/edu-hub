import type { Exam } from "@prisma/client";
import { canOpenUnit, getUnit, type Viewer } from "./access";
import { prisma } from "./prismaDb";

/**
 * Whether a viewer may take an exam:
 * signin   – guests never take exams;
 * paid     – the exam's unit is sold and the student does not own it;
 * progress – the unlock rule's videos are not all watched yet (done/total);
 * open     – go.
 */
export type ExamStatus =
	| { state: "open" }
	| { state: "signin" }
	| { state: "paid" }
	| { state: "progress"; done: number; total: number };

/** The folder and every folder below it (one query for the class, walked in memory). */
async function subtreeIds(folderId: string) {
	const folder = await prisma.folder.findUnique({
		where: { id: folderId },
		select: { classId: true },
	});
	if (!folder) return [folderId];
	const all = await prisma.folder.findMany({
		where: { classId: folder.classId },
		select: { id: true, parentFolderId: true },
	});
	const ids = [folderId];
	for (let i = 0; i < ids.length; i++) {
		for (const f of all) if (f.parentFolderId === ids[i]) ids.push(f.id);
	}
	return ids;
}

export async function getExamStatus(
	exam: Pick<Exam, "folderId" | "unlockRule">,
	viewer: Viewer
): Promise<ExamStatus> {
	if (!viewer) return { state: "signin" };
	if (viewer.role === "ADMIN") return { state: "open" };
	if (!canOpenUnit(viewer, await getUnit(exam.folderId)))
		return { state: "paid" };
	if (exam.unlockRule !== "FOLDER" && exam.unlockRule !== "TREE")
		return { state: "open" };

	const folderIds =
		exam.unlockRule === "TREE"
			? await subtreeIds(exam.folderId)
			: [exam.folderId];
	// Every video counts: Bunny ones too, which students mark done by hand.
	const videos = await prisma.video.findMany({
		where: { folderId: { in: folderIds } },
		select: { id: true },
	});
	if (!videos.length) return { state: "open" };
	const done = await prisma.videoProgress.count({
		where: {
			userId: viewer.id,
			videoId: { in: videos.map((v) => v.id) },
			completed: true,
		},
	});
	return done >= videos.length
		? { state: "open" }
		: { state: "progress", done, total: videos.length };
}

/** The student's view of a question: never the answer key. */
export const publicQuestionSelect = {
	id: true,
	lesson: true,
	text: true,
	image: true,
	source: true,
	options: true,
} as const;

/** Questions `offset`..`offset+limit` of an exam, in the exam's order. */
export async function getExamQuestions(
	questionIds: string[],
	offset: number,
	limit: number
) {
	const ids = questionIds.slice(offset, offset + limit);
	const rows = await prisma.question.findMany({
		where: { id: { in: ids } },
		select: publicQuestionSelect,
	});
	const byId = new Map(rows.map((row) => [row.id, row]));
	return ids.flatMap((id) => byId.get(id) ?? []);
}
