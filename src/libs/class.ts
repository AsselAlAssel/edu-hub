import { SIGNIN_FILE_URL } from "./constant";
import { prisma } from "./prismaDb";

const classInclude = {
	folders: { where: { isRoot: true } },
	_count: { select: { files: true, videos: true } },
} as const;

/** Public list; admins pass `includeHidden` to also get hidden classes. */
export const getClasses = (includeHidden = false) =>
	prisma.class.findMany({
		where: includeHidden ? undefined : { hidden: false },
		include: classInclude,
		orderBy: { createdAt: "asc" },
	});

export type ClassWithMeta = Awaited<ReturnType<typeof getClasses>>[number];

export const getClass = (classId: string) =>
	prisma.class.findUnique({
		where: { id: classId },
		include: classInclude,
	});

/**
 * A folder's contents. Files go only to signed-in users (`withFileUrls`):
 * guests get them without name or link (url = SIGNIN_FILE_URL).
 */
export const getResources = async (folderId: string, withFileUrls = false) => {
	const orderBy = [{ rank: "asc" as const }, { createdAt: "asc" as const }];
	const [folders, videos, files] = await Promise.all([
		prisma.folder.findMany({ where: { parentFolderId: folderId }, orderBy }),
		prisma.video.findMany({ where: { folderId }, orderBy }),
		prisma.file.findMany({ where: { folderId }, orderBy }),
	]);

	const lock = (file: (typeof files)[number]) =>
		withFileUrls ? file : { ...file, name: "", url: SIGNIN_FILE_URL };

	return { folders, files: files.map(lock), videos };
};

export type Resources = Awaited<ReturnType<typeof getResources>>;
