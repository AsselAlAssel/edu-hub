import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";
import { prisma } from "@/libs/prismaDb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com";

	const cacheFile = path.join(process.cwd(), "sitemap-cache.json");

	if (fs.existsSync(cacheFile)) {
		const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
		if (
			new Date().getTime() - new Date(cacheData.timestamp).getTime() <
			7 * 24 * 60 * 60 * 1000
		) {
			return cacheData.sitemap;
		}
	}

	try {
		const classes = await prisma.class.findMany({
			include: {
				folders: {
					where: {
						isRoot: true,
					},
				},
			},
		});

		const foldersPromises = classes.map(async (classItem) => {
			if (!classItem.folders[0]?.id) return [];

			const folders = await prisma.folder.findMany({
				where: {
					parentFolderId: classItem.folders[0]?.id,
				},
			});

			return folders.map((folder) => ({
				url: `${baseUrl}/class/${classItem.id}/folder/${folder.id}`,
				lastModified: folder.updatedAt || new Date(),
			}));
		});

		const foldersResults = await Promise.all(foldersPromises);

		const sitemap = [
			{ url: baseUrl, lastModified: new Date() },
			...foldersResults.flat(),
		];

		fs.writeFileSync(
			cacheFile,
			JSON.stringify({ sitemap, timestamp: new Date() })
		);

		return sitemap;
	} catch (error) {
		console.error("Sitemap generation error:", error);
		return [{ url: baseUrl, lastModified: new Date() }];
	}
}
