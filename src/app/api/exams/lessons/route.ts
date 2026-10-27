import { requireAdmin } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Admin: each lesson with its question count, in the order lessons were added. */
export const GET = async () => {
	const denied = await requireAdmin();
	if (denied) return denied;

	// ponytail: scans two short fields of every question (fine for a few thousand);
	// add a Lesson model with its own rank if the bank grows far past that.
	// ObjectIds are increasing, so id order is insertion order even for bulk inserts.
	const rows = await prisma.question.findMany({
		select: { lesson: true, image: true },
		orderBy: { id: "asc" },
	});
	const lessons = new Map<string, { count: number; withImages: number }>();
	for (const { lesson, image } of rows) {
		const entry = lessons.get(lesson) ?? { count: 0, withImages: 0 };
		entry.count++;
		if (image) entry.withImages++;
		lessons.set(lesson, entry);
	}
	return NextResponse.json(
		Array.from(lessons, ([lesson, stats]) => ({ lesson, ...stats }))
	);
};
