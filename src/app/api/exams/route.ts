import { jsonError, readJson, requireAdmin } from "@/libs/api";
import { parseExam } from "@/libs/exams";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Admin: every exam, plus the folders an exam can be attached to. */
export const GET = async () => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const [exams, folders] = await Promise.all([
		prisma.exam.findMany({ orderBy: { createdAt: "asc" } }),
		prisma.folder.findMany({
			where: { isRoot: false },
			select: {
				id: true,
				name: true,
				parentClass: { select: { name: true } },
				parentFolder: { select: { name: true, isRoot: true } },
			},
			orderBy: [{ classId: "asc" }, { rank: "asc" }],
		}),
	]);
	return NextResponse.json({
		exams,
		folders: folders.map((f) => ({
			id: f.id,
			// "Class › parent › folder" so same-named folders stay distinguishable.
			label: [
				f.parentClass.name,
				f.parentFolder && !f.parentFolder.isRoot ? f.parentFolder.name : null,
				f.name,
			]
				.filter(Boolean)
				.join(" › "),
		})),
	});
};

export const POST = async (req: Request) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const parsed = parseExam(await readJson(req));
	if (!parsed.data) return jsonError(parsed.error, 400);
	if (!(await prisma.folder.count({ where: { id: parsed.data.folderId } })))
		return jsonError("المجلد غير موجود", 400);
	return NextResponse.json(await prisma.exam.create({ data: parsed.data }));
};
