import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prismaDb";

export function absoluteUrl(path: string) {
	return `${process.env.SITE_URL || "http://localhost:3000"}${path}`;
}

export const getIsAuthorized = async () => {
	const session = await getServerSession(authOptions);
	return session?.user;
};
export const isAdmin = async () => {
	const session = await getServerSession(authOptions);
	return session?.user?.role === "ADMIN";
};

export const isUser = async () => {
	const session = await getServerSession(authOptions);
	return session?.user?.role === "USER" || session?.user?.role === "ADMIN";
};

export const recursiveDelete = async (folderId: string) => {
	const folders = await prisma.folder.findMany({
		where: { parentFolderId: folderId },
	});

	if (folders.length === 0) {
		await prisma.file.deleteMany({ where: { folderId } });
		await prisma.video.deleteMany({ where: { folderId } });
		await prisma.folder.delete({ where: { id: folderId } });
		return;
	}

	await Promise.all(
		folders.map(async (folder) => {
			await recursiveDelete(folder.id);
		})
	);

	await prisma.file.deleteMany({ where: { folderId } });
	await prisma.video.deleteMany({ where: { folderId } });
	await prisma.folder.delete({ where: { id: folderId } });
};
