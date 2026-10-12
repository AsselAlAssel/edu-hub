import { MetadataRoute } from "next";
import { prisma } from "@/libs/prismaDb";
import { SITE_URL } from "@/libs/site";
import { folderSitemapEntries } from "@/libs/sitemap";

// Regenerated at most daily.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{ url: SITE_URL, lastModified: new Date(), priority: 1 },
		{ url: `${SITE_URL}/classes`, lastModified: new Date(), priority: 0.9 },
	];

	try {
		const folders = await prisma.folder.findMany({
			select: {
				id: true,
				classId: true,
				parentFolderId: true,
				isRoot: true,
				updatedAt: true,
			},
		});
		return [...staticPages, ...folderSitemapEntries(folders)];
	} catch (error) {
		console.error("Sitemap generation error:", error);
		return staticPages;
	}
}
