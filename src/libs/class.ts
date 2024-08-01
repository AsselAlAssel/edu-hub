import { prisma } from "./prismaDb";

export const getClasses = async () => {
	const classes = await prisma.class.findMany({
		include: {
			folders: {
				where: {
					isRoot: true,
				},
			},
		},
	});

	return classes;
};

export const getClass = async (classId: string) => {
	const classData = await prisma.class.findUnique({
		where: {
			id: classId,
		},
		include: {
			folders: {
				where: {
					isRoot: true,
				},
			},
		},
	});

	return classData;
};

export const getResources = async (folderId: string) => {
	const folders = await prisma.folder.findMany({
		where: {
			parentFolderId: folderId,
		},
	});
	const resources = await prisma.resource.findMany({
		where: {
			folderId: folderId,
		},
	});

	const resourceData = {
		folders,
		resources,
	};

	return resourceData;
};
