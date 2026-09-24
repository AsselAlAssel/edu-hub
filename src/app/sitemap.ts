import { MetadataRoute } from "next";
import { prisma } from "@/libs/prismaDb";
import { SITE_URL } from "@/libs/site";

// Regenerated at most daily. Replaces the runtime writes to sitemap-cache.json,
// which fail on read-only serverless filesystems.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{ url: SITE_URL, lastModified: new Date(), priority: 1 },
		{ url: `${SITE_URL}/classes`, lastModified: new Date(), priority: 0.9 },
	];

	try {
		const classes = await prisma.class.findMany({
			include: { folders: { where: { isRoot: true }, select: { id: true } } },
		});

		const folderPages = await Promise.all(
			classes.map(async (classItem) => {
				const rootId = classItem.folders[0]?.id;
				if (!rootId) return [];

				const folders = await prisma.folder.findMany({
					where: { parentFolderId: rootId },
					select: { id: true, updatedAt: true },
				});

				return [
					{
						url: `${SITE_URL}/class/${classItem.id}/folder/${rootId}`,
						lastModified: classItem.updatedAt,
						priority: 0.8,
					},
					...folders.map((folder) => ({
						url: `${SITE_URL}/class/${classItem.id}/folder/${folder.id}`,
						lastModified: folder.updatedAt,
						priority: 0.6,
					})),
				];
			})
		);

		return [...staticPages, ...folderPages.flat()];
	} catch (error) {
		console.error("Sitemap generation error:", error);
		return staticPages;
	}
}
