import { getViewer } from "@/libs/access";
import { isObjectId } from "@/libs/api";
import { getExamStatus } from "@/libs/examAccess";
import { prisma } from "@/libs/prismaDb";
import ExamPage from "@/scenes/ExamPage/ExamPage";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "امتحان",
	robots: { index: false, follow: false },
};

type Props = { params: Promise<{ examId: string }> };

export default async function Page(props: Props) {
	const { examId } = await props.params;
	if (!isObjectId(examId)) notFound();
	const exam = await prisma.exam.findUnique({
		where: { id: examId },
		select: {
			id: true,
			title: true,
			folderId: true,
			unlockRule: true,
			questionIds: true,
		},
	});
	if (!exam) notFound();
	const folder = await prisma.folder.findUnique({
		where: { id: exam.folderId },
		select: { classId: true, parentClass: { select: { hidden: true } } },
	});
	if (!folder) notFound();

	const viewer = await getViewer();
	// A hidden class is for admins only.
	if (folder.parentClass.hidden && viewer?.role !== "ADMIN")
		redirect("/classes");
	const status = await getExamStatus(exam, viewer);
	// The folder's exams panel says what is still locking it (or offers sign-in).
	const folderHref = `/class/${folder.classId}/folder/${exam.folderId}`;
	if (status.state !== "open") redirect(folderHref);

	return (
		<ExamPage
			examId={exam.id}
			title={exam.title}
			total={exam.questionIds.length}
			backHref={folderHref}
		/>
	);
}
