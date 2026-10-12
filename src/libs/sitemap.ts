import type { MetadataRoute } from "next";
import { SITE_URL } from "@/libs/site";

export type FolderRow = {
	id: string;
	classId: string;
	parentFolderId: string | null;
	isRoot: boolean;
	updatedAt: Date;
};

/**
 * Every folder page reachable from a class root, at any depth. Walking down
 * from the roots skips orphans whose parent was deleted (they would 404).
 */
export function folderSitemapEntries(
	folders: FolderRow[]
): MetadataRoute.Sitemap {
	const children = new Map<string, FolderRow[]>();
	for (const folder of folders) {
		if (!folder.parentFolderId) continue;
		const siblings = children.get(folder.parentFolderId) ?? [];
		siblings.push(folder);
		children.set(folder.parentFolderId, siblings);
	}

	const entries: MetadataRoute.Sitemap = [];
	const seen = new Set<string>();
	const visit = (folder: FolderRow, depth: number) => {
		if (seen.has(folder.id)) return;
		seen.add(folder.id);
		entries.push({
			url: `${SITE_URL}/class/${folder.classId}/folder/${folder.id}`,
			lastModified: folder.updatedAt,
			priority: depth === 0 ? 0.8 : depth === 1 ? 0.6 : 0.5,
		});
		for (const child of children.get(folder.id) ?? []) {
			if (child.classId === folder.classId) visit(child, depth + 1);
		}
	};
	for (const folder of folders) if (folder.isRoot) visit(folder, 0);
	return entries;
}
