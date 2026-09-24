import { prisma } from "@/libs/prismaDb";

/**
 * Landing CMS document. Plain server helper (was a "use server" action,
 * which needlessly exposed it as a public POST endpoint).
 */
export const getLandingData = () => prisma.landingPage.findFirst();

export type PlatformStats = { classes: number; videos: number; files: number };

/** Real content counts for the hero; null if the database is unreachable. */
export async function getPlatformStats(): Promise<PlatformStats | null> {
	try {
		const [classes, videos, files] = await Promise.all([
			prisma.class.count(),
			prisma.video.count(),
			prisma.file.count(),
		]);
		return { classes, videos, files };
	} catch {
		return null;
	}
}
