import { PrismaClient } from "@prisma/client";
import { LexoRank } from "lexorank";

const prisma = new PrismaClient();

async function seedRanks() {
	console.log("Starting rank migration...");

	const folders = await prisma.folder.findMany({
		where: { rank: null },
		orderBy: { createdAt: "asc" },
	});

	const foldersByParent = new Map<string, typeof folders>();
	for (const folder of folders) {
		const key = folder.parentFolderId ?? "root";
		if (!foldersByParent.has(key)) foldersByParent.set(key, []);
		foldersByParent.get(key)!.push(folder);
	}

	let folderCount = 0;
	for (const [parentId, group] of foldersByParent) {
		let rank = LexoRank.middle();
		for (const folder of group) {
			await prisma.folder.update({
				where: { id: folder.id },
				data: { rank: rank.toString() },
			});
			rank = rank.genNext();
			folderCount++;
		}
		console.log(
			`  Folders under parent ${parentId}: ${group.length} ranked`
		);
	}

	const files = await prisma.file.findMany({
		where: { rank: null },
		orderBy: { createdAt: "asc" },
	});

	const filesByFolder = new Map<string, typeof files>();
	for (const file of files) {
		if (!filesByFolder.has(file.folderId)) filesByFolder.set(file.folderId, []);
		filesByFolder.get(file.folderId)!.push(file);
	}

	let fileCount = 0;
	for (const [folderId, group] of filesByFolder) {
		let rank = LexoRank.middle();
		for (const file of group) {
			await prisma.file.update({
				where: { id: file.id },
				data: { rank: rank.toString() },
			});
			rank = rank.genNext();
			fileCount++;
		}
		console.log(`  Files in folder ${folderId}: ${group.length} ranked`);
	}

	const videos = await prisma.video.findMany({
		where: { rank: null },
		orderBy: { createdAt: "asc" },
	});

	const videosByFolder = new Map<string, typeof videos>();
	for (const video of videos) {
		if (!videosByFolder.has(video.folderId))
			videosByFolder.set(video.folderId, []);
		videosByFolder.get(video.folderId)!.push(video);
	}

	let videoCount = 0;
	for (const [folderId, group] of videosByFolder) {
		let rank = LexoRank.middle();
		for (const video of group) {
			await prisma.video.update({
				where: { id: video.id },
				data: { rank: rank.toString() },
			});
			rank = rank.genNext();
			videoCount++;
		}
		console.log(`  Videos in folder ${folderId}: ${group.length} ranked`);
	}

	console.log(
		`\nMigration complete: ${folderCount} folders, ${fileCount} files, ${videoCount} videos`
	);
}

seedRanks()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
