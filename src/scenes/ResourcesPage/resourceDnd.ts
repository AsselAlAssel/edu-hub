import type { File, Folder, Video } from "@prisma/client";

export type ResourceKind = "folder" | "file" | "video";
export type ResourceData = {
	folders: Folder[];
	files: File[];
	videos: Video[];
};

export const dataKey = {
	folder: "folders",
	file: "files",
	video: "videos",
} as const satisfies Record<ResourceKind, keyof ResourceData>;

export const kindLabel: Record<ResourceKind, string> = {
	folder: "المجلد",
	file: "الملف",
	video: "الفيديو",
};

export function getItemKind(
	data: ResourceData,
	id: string
): ResourceKind | null {
	if (data.folders.some((item) => item.id === id)) return "folder";
	if (data.files.some((item) => item.id === id)) return "file";
	if (data.videos.some((item) => item.id === id)) return "video";
	return null;
}

type Rankable = { id: string; rank?: string | null };

/**
 * Moves `activeId` to `overId`'s position. Returns the new order and the
 * neighbour ranks the server needs, or null for a no-op.
 */
export function computeReorder<T extends Rankable>(
	items: T[],
	activeId: string,
	overId: string
) {
	const oldIndex = items.findIndex((item) => item.id === activeId);
	const newIndex = items.findIndex((item) => item.id === overId);
	if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return null;

	const sorted = [...items];
	const [moved] = sorted.splice(oldIndex, 1);
	sorted.splice(newIndex, 0, moved);

	return {
		sorted,
		moved,
		beforeRank: sorted[newIndex - 1]?.rank ?? null,
		afterRank: sorted[newIndex + 1]?.rank ?? null,
	};
}

/** What a finished drag means: move into a folder, reorder, or nothing. */
export function resolveDrop(
	data: ResourceData,
	activeId: string,
	overId: string | null
) {
	if (!overId || activeId === overId) return { type: "none" } as const;
	const activeKind = getItemKind(data, activeId);
	const overKind = getItemKind(data, overId);
	if (!activeKind || !overKind) return { type: "none" } as const;

	if (
		(activeKind === "file" || activeKind === "video") &&
		overKind === "folder"
	) {
		return {
			type: "move",
			kind: activeKind,
			id: activeId,
			targetFolderId: overId,
		} as const;
	}
	if (activeKind === overKind) {
		const items: Rankable[] = data[dataKey[activeKind]];
		const result = computeReorder(items, activeId, overId);
		return result
			? ({ type: "reorder", kind: activeKind, ...result } as const)
			: ({ type: "none" } as const);
	}
	return { type: "none" } as const;
}

export function removeItem(
	data: ResourceData,
	kind: ResourceKind,
	id: string
): ResourceData {
	const key = dataKey[kind];
	return {
		...data,
		[key]: (data[key] as Rankable[]).filter((item) => item.id !== id),
	};
}

export function renameItem(
	data: ResourceData,
	kind: ResourceKind,
	id: string,
	name: string
): ResourceData {
	const key = dataKey[kind];
	return {
		...data,
		[key]: (data[key] as (Rankable & { name: string })[]).map((item) =>
			item.id === id ? { ...item, name } : item
		),
	};
}
