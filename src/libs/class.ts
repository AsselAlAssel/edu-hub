import { prisma } from "./prismaDb";

const classInclude = {
	folders: { where: { isRoot: true } },
	_count: { select: { files: true, videos: true } },
} as const;

export const getClasses = () =>
	prisma.class.findMany({
		include: classInclude,
		orderBy: { createdAt: "asc" },
	});

export type ClassWithMeta = Awaited<ReturnType<typeof getClasses>>[number];

export const getClass = (classId: string) =>
	prisma.class.findUnique({
		where: { id: classId },
		include: classInclude,
	});

export const getResources = async (folderId: string) => {
	const orderBy = [{ rank: "asc" as const }, { createdAt: "asc" as const }];
	const [folders, videos, files] = await Promise.all([
		prisma.folder.findMany({ where: { parentFolderId: folderId }, orderBy }),
		prisma.video.findMany({ where: { folderId }, orderBy }),
		prisma.file.findMany({ where: { folderId }, orderBy }),
	]);

	return { folders, files, videos };
};

export type Resources = Awaited<ReturnType<typeof getResources>>;
