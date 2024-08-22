import { prisma } from "./prismaDb";

export async function getBreadcrumbs(
	folderId: string,
	breadcrumbs: Array<{ id: string; name: string }> = []
) {
	const folder = await prisma.folder.findUnique({
		where: {
			id: folderId,
		},
		select: {
			id: true,
			name: true,
			parentFolderId: true,
		},
	});

	if (!folder) {
		throw new Error("Folder not found");
	}

	// Add the current folder to the breadcrumbs array
	breadcrumbs.unshift({ id: folder.id, name: folder.name });

	// If the folder has a parent, continue traversing up the tree
	if (folder.parentFolderId) {
		return getBreadcrumbs(folder.parentFolderId, breadcrumbs);
	}

	return breadcrumbs;
}
