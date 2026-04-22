import axios from "axios";

export type ReorderType = "folder" | "file" | "video";

export type ReorderParams = {
	type: ReorderType;
	id: string;
	beforeRank?: string | null;
	afterRank?: string | null;
};

export async function reorderItem(params: ReorderParams) {
	const response = await axios.post("/api/reorder", params);
	return response.data;
}
