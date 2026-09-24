"use client";
import { getErrorMessage } from "@/libs/errors";
import {
	createFolderRequest,
	deleteFolderRequest,
	updateFolderRequest,
} from "@/services/folder.service";
import { moveResourceItem } from "@/services/move.service";
import { reorderItem } from "@/services/reorder.service";
import {
	deleteFileRequest,
	deleteVideoRequest,
	postFile,
	postVideo,
	updateFileNameRequest,
	updateVideoNameRequest,
} from "@/services/resource.service";
import { getExtension } from "@/libs/uploadRules";
import { uploadToStorage } from "@/services/upload.service";
import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import {
	dataKey,
	removeItem,
	renameItem,
	type ResourceData,
	type ResourceKind,
} from "./resourceDnd";

export const resourcesKey = (folderId: string) => `/api/resources/${folderId}`;

/**
 * All explorer writes. Deletes/renames/moves/reorders are optimistic and roll
 * back on failure; creates revalidate after the server confirms.
 */
export function useResourceMutations(folderId: string, classId: string) {
	const { mutate } = useSWRConfig();
	const key = resourcesKey(folderId);
	const [pending, setPending] = useState<string | null>(null);

	/** Runs `request` with an optimistic cache update and rollback on error. */
	const optimistic = async (
		update: (current: ResourceData) => ResourceData,
		request: () => Promise<unknown>,
		messages: { success?: string; error: string }
	) => {
		try {
			// populateCache:false — the response body is ignored; revalidation refreshes.
			await mutate<ResourceData>(
				key,
				request().then(() => undefined as unknown as ResourceData),
				{
					optimisticData: (current) =>
						current ? update(current) : (current as unknown as ResourceData),
					rollbackOnError: true,
					populateCache: false,
					revalidate: true,
				}
			);
			if (messages.success) toast.success(messages.success);
			return true;
		} catch (error) {
			toast.error(getErrorMessage(error, messages.error));
			return false;
		}
	};

	const withPending = async <T>(name: string, run: () => Promise<T>) => {
		setPending(name);
		try {
			return await run();
		} finally {
			setPending(null);
		}
	};

	return {
		pending,

		createFolder: (name: string) =>
			withPending("folder", async () => {
				try {
					await createFolderRequest({
						name,
						parentFolderId: folderId,
						classId,
					});
					await mutate(key);
					toast.success("تم إنشاء المجلد");
					return true;
				} catch (error) {
					toast.error(getErrorMessage(error, "تعذّر إنشاء المجلد"));
					return false;
				}
			}),

		addVideo: (values: { name: string; url: string; videoId: string }) =>
			withPending("video", async () => {
				try {
					await postVideo("/api/video", { ...values, folderId, classId });
					await mutate(key);
					toast.success("تمت إضافة الفيديو");
					return true;
				} catch (error) {
					toast.error(getErrorMessage(error, "تعذّر إضافة الفيديو"));
					return false;
				}
			}),

		uploadFile: (file: File, displayName: string) =>
			withPending("file", async () => {
				try {
					const url = await uploadToStorage(file);
					await postFile("/api/file", {
						name: displayName,
						url,
						folderId,
						classId,
						type: getExtension(file.name),
					});
					await mutate(key);
					toast.success("تم رفع الملف");
					return true;
				} catch (error) {
					// uploadToStorage throws Errors with Arabic messages; API errors are axios errors.
					toast.error(
						isAxiosError(error) || !(error instanceof Error)
							? getErrorMessage(error, "فشل رفع الملف")
							: error.message
					);
					return false;
				}
			}),

		rename: (kind: ResourceKind, id: string, name: string) =>
			withPending("rename", () =>
				optimistic(
					(current) => renameItem(current, kind, id, name),
					() =>
						kind === "folder"
							? updateFolderRequest({ folderId: id, name })
							: kind === "file"
								? updateFileNameRequest("/api/file", { fileId: id, name })
								: updateVideoNameRequest("/api/video", { videoId: id, name }),
					{ success: "تم حفظ الاسم", error: "تعذّر حفظ الاسم" }
				)
			),

		remove: (kind: ResourceKind, id: string) =>
			withPending("delete", () =>
				optimistic(
					(current) => removeItem(current, kind, id),
					() =>
						kind === "folder"
							? deleteFolderRequest({ folderId: id })
							: kind === "file"
								? deleteFileRequest("/api/file", { fileId: id })
								: deleteVideoRequest("/api/video", { videoId: id }),
					{
						success:
							kind === "folder"
								? "تم حذف المجلد"
								: kind === "file"
									? "تم حذف الملف"
									: "تم حذف الفيديو",
						error: "تعذّر الحذف",
					}
				)
			),

		move: async (
			kind: "file" | "video",
			id: string,
			targetFolderId: string,
			targetName: string
		) => {
			const ok = await optimistic(
				(current) => removeItem(current, kind, id),
				() => moveResourceItem({ type: kind, id, targetFolderId }),
				{ success: `تم النقل إلى «${targetName}»`, error: "تعذّر نقل العنصر" }
			);
			if (ok) void mutate(resourcesKey(targetFolderId));
			return ok;
		},

		reorder: (
			kind: ResourceKind,
			sorted: { id: string }[],
			movedId: string,
			beforeRank: string | null,
			afterRank: string | null
		) =>
			optimistic(
				(current) => ({ ...current, [dataKey[kind]]: sorted }),
				() => reorderItem({ type: kind, id: movedId, beforeRank, afterRank }),
				{ error: "تعذّر حفظ الترتيب الجديد" }
			),
	};
}
