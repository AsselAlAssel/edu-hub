import { cache } from "react";
import { prisma } from "./prismaDb";

/** `price` is set on a priced first-level folder (a paid unit). */
export type BreadcrumbItem = {
	id: string;
	name: string;
	price?: number | null;
};

const MAX_DEPTH = 50;

/**
 * Folder chain from the class root down to `folderId`, or null if it does not
 * exist. Cached per render, so the folder page and getUnit share one walk.
 */
export const getBreadcrumbs = cache(async function getBreadcrumbs(
	folderId: string
): Promise<BreadcrumbItem[] | null> {
	const breadcrumbs: BreadcrumbItem[] = [];
	let currentId: string | null = folderId;

	// Depth cap guards against corrupted parent cycles.
	while (currentId && breadcrumbs.length < MAX_DEPTH) {
		const folder: {
			id: string;
			name: string;
			price: number | null;
			parentFolderId: string | null;
		} | null = await prisma.folder.findUnique({
			where: { id: currentId },
			select: { id: true, name: true, price: true, parentFolderId: true },
		});
		if (!folder) return breadcrumbs.length ? breadcrumbs : null;
		breadcrumbs.unshift({
			id: folder.id,
			name: folder.name,
			price: folder.price,
		});
		currentId = folder.parentFolderId;
	}

	return breadcrumbs;
});
