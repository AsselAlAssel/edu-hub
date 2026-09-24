import { revalidatePath } from "next/cache";

/**
 * Folder/file/video writes change the cached (ISR) resource pages and the
 * class counts; mark them stale so visitors see the change on the next load.
 */
export function revalidateResourcePages() {
	revalidatePath("/class/[classId]/folder/[folderId]", "page");
	revalidatePath("/classes");
	revalidatePath("/");
}
