import { prisma } from "./prismaDb";

export type BreadcrumbItem = { id: string; name: string };

const MAX_DEPTH = 50;

/** Folder chain from the class root down to `folderId`, or null if it does not exist. */
export async function getBreadcrumbs(
	folderId: string
): Promise<BreadcrumbItem[] | null> {
	const breadcrumbs: BreadcrumbItem[] = [];
	let currentId: string | null = folderId;

	// Depth cap guards against corrupted parent cycles.
	while (currentId && breadcrumbs.length < MAX_DEPTH) {
		const folder: {
			id: string;
			name: string;
			parentFolderId: string | null;
		} | null = await prisma.folder.findUnique({
			where: { id: currentId },
			select: { id: true, name: true, parentFolderId: true },
		});
		if (!folder) return breadcrumbs.length ? breadcrumbs : null;
		breadcrumbs.unshift({ id: folder.id, name: folder.name });
		currentId = folder.parentFolderId;
	}

	return breadcrumbs;
}
