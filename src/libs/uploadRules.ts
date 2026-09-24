/** Upload limits shared by the upload dialogs (client) and the URL signer (server). */
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_FILE_EXTENSIONS = [
	"pdf",
	"doc",
	"docx",
	"ppt",
	"pptx",
	"xls",
	"xlsx",
	"txt",
	"jpg",
	"jpeg",
	"png",
	"gif",
	"webp",
	"mp3",
	"mp4",
	"zip",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

export const getExtension = (fileName: string) => {
	const dot = fileName.lastIndexOf(".");
	return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "";
};

export type UploadKind = "file" | "image";

/** Returns an Arabic error message, or null when the upload is acceptable. */
export function validateUpload(
	file: { name: string; size: number },
	kind: UploadKind = "file"
): string | null {
	const extension = getExtension(file.name);
	const allowed: readonly string[] =
		kind === "image" ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_FILE_EXTENSIONS;
	const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_UPLOAD_BYTES;

	if (!Number.isFinite(file.size) || file.size <= 0) return "الملف فارغ";
	if (!allowed.includes(extension)) {
		return `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowed.join("، ")}`;
	}
	if (file.size > maxBytes) {
		return `حجم الملف يتجاوز الحد المسموح (${Math.round(maxBytes / 1024 / 1024)} ميغابايت)`;
	}
	return null;
}
