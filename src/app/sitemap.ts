import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";
import { prisma } from "@/libs/prismaDb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl =
		process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com";

	const cacheFile = path.join(process.cwd(), "sitemap-cache.json");

	// التحقق من وجود الملف المؤقت وصلاحية البيانات (أسبوع واحد)
	if (fs.existsSync(cacheFile)) {
		const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
		if (
			new Date().getTime() - new Date(cacheData.timestamp).getTime() <
			7 * 24 * 60 * 60 * 1000
		) {
			return cacheData.sitemap;
		}
	}

	// استعلام قاعدة البيانات لجلب الصفوف
	const classes = await prisma.class.findMany({
		include: {
			folders: {
				where: {
					isRoot: true,
				},
			},
		},
	});

	// جلب المجلدات الجذرية لكل صف
	const foldersPromises = classes.map(async (classItem) => {
		// تحقق من وجود مجلد الجذر للصف
		if (!classItem.folders[0]?.id) return [];

		// استعلام لجلب المجلدات الجذرية
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

	// انتظار جميع استعلامات المجلدات
	const foldersResults = await Promise.all(foldersPromises);

	// بناء السايت ماب
	const sitemap = [
		{ url: baseUrl, lastModified: new Date() }, // الصفحة الرئيسية
		...foldersResults.flat(), // إضافة روابط المجلدات
	];

	// تخزين النتيجة في الملف المؤقت
	fs.writeFileSync(
		cacheFile,
		JSON.stringify({ sitemap, timestamp: new Date() })
	);

	return sitemap;
}
