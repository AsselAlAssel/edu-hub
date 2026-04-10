import axios from "axios";
import { mutate } from "swr";

export type ReorderType = "folder" | "file" | "video";

interface ReorderParams {
	type: ReorderType;
	id: string;
	beforeRank?: string | null;
	afterRank?: string | null;
}

export async function reorderItem(params: ReorderParams) {
	const response = await axios.post("/api/reorder", params);
	return response.data;
}

export function useReorder(folderId: string) {
	const handleReorder = async (params: ReorderParams) => {
		await reorderItem(params);
		mutate(`/api/resources/${folderId}`);
	};

	return { reorder: handleReorder };
}
