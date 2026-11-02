import { prisma } from "@/libs/prismaDb";

/**
 * Landing CMS document. Plain server helper (was a "use server" action,
 * which needlessly exposed it as a public POST endpoint).
 */
export const getLandingData = () => prisma.landingPage.findFirst();

export type PlatformStats = {
	classes: number;
	videos: number;
	files: number;
	exams: number;
};

/**
 * Real content counts for the hero, hidden classes left out; null if the
 * database is unreachable.
 */
export async function getPlatformStats(): Promise<PlatformStats | null> {
	const visible = { class: { hidden: false } };
	try {
		const [classes, videos, files, folders] = await Promise.all([
			prisma.class.count({ where: { hidden: false } }),
			prisma.video.count({ where: visible }),
			prisma.file.count({ where: visible }),
			prisma.folder.findMany({
				where: { parentClass: { hidden: false } },
				select: { id: true },
			}),
		]);
		// Exams only store a folderId, no relation to filter through.
		const exams = await prisma.exam.count({
			where: { folderId: { in: folders.map((f) => f.id) } },
		});
		return { classes, videos, files, exams };
	} catch {
		return null;
	}
}
