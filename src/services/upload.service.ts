import { getSignedURL } from "@/actions/upload";
import type { UploadKind } from "@/libs/uploadRules";
import axios from "axios";

/** PUT the file body to a presigned R2 URL (Content-Type must match the signature). */
export async function putFileToPresignedUrl(url: string, file: File) {
	return axios.put(url, file, {
		headers: { "Content-Type": file.type || "application/octet-stream" },
	});
}

/**
 * Signs, uploads and returns the public URL of the stored object.
 * Throws an Error with an Arabic message on failure.
 */
export async function uploadToStorage(file: File, kind: UploadKind = "file") {
	const signed = await getSignedURL(
		{ name: file.name, type: file.type, size: file.size },
		kind
	);
	if ("failure" in signed && signed.failure) throw new Error(signed.failure);
	if (!("success" in signed) || !signed.success)
		throw new Error("فشل رفع الملف");

	const response = await putFileToPresignedUrl(signed.success.url, file);
	if (response.status < 200 || response.status >= 300) {
		throw new Error("فشل رفع الملف");
	}
	return `${process.env.NEXT_PUBLIC_FILES_URL}/${signed.success.key}`;
}
