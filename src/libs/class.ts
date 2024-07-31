import { prisma } from "./prismaDb";

const getNumberOfResources = async (classId: string) => {
	const folders = await prisma.folder.count({
		where: {
			classId,
		},
	});

	const videos = await prisma.video.count({
		where: {
			classId,
		},
	});

	return {
		folders,
		videos,
	};
};

export const getClasses = async () => {
	const classes = await prisma.class.findMany();
	const classesWithResources = await Promise.all(
		classes.map(async (classItem) => {
			const { folders, videos } = await getNumberOfResources(classItem.id);
			return {
				...classItem,
				folders,
				videos,
			};
		})
	);

	return classesWithResources;
};

export const getClass = async (classId: string) => {
	const folders = await prisma.folder.findMany({
		where: {
			classId,
		},
	});

	const videos = await prisma.video.findMany({
		where: {
			classId,
		},
	});

	return {
		folders,
		videos,
	};

}
