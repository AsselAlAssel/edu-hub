import { prisma } from "./prismaDb";
import { deleteR2Object, r2KeyFromUrl } from "./r2";

/** Deletes a folder, its sub-folders, their files/videos and the stored file objects. */
export const recursiveDelete = async (folderId: string): Promise<void> => {
	const children = await prisma.folder.findMany({
		where: { parentFolderId: folderId },
		select: { id: true },
	});

	await Promise.all(children.map((child) => recursiveDelete(child.id)));

	const files = await prisma.file.findMany({
		where: { folderId },
		select: { url: true },
	});

	await prisma.file.deleteMany({ where: { folderId } });
	await prisma.video.deleteMany({ where: { folderId } });
	await prisma.folder.delete({ where: { id: folderId } });

	await Promise.all(
		files
			.map((file) => r2KeyFromUrl(file.url))
			.filter((key): key is string => !!key)
			.map(deleteR2Object)
	);
};
