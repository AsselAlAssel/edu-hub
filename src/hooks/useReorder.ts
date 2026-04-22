import { reorderItem, type ReorderParams } from "@/services/reorder.service";
import { mutate } from "swr";

export { reorderItem };
export type { ReorderParams, ReorderType } from "@/services/reorder.service";

export function useReorder(folderId: string) {
	const handleReorder = async (params: ReorderParams) => {
		await reorderItem(params);
		mutate(`/api/resources/${folderId}`);
	};

	return { reorder: handleReorder };
}
