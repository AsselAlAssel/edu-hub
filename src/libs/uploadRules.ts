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
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"];

export const getExtension = (fileName: string) => {
	const dot = fileName.lastIndexOf(".");
	return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "";
};

/** Whether a media URL (uploaded or pasted) points at a video file. */
export const isVideoUrl = (url: string) => {
	try {
		return ALLOWED_VIDEO_EXTENSIONS.includes(
			getExtension(new URL(url).pathname)
		);
	} catch {
		return false;
	}
};

/** "media": an image or a video (the results page gallery). */
export type UploadKind = "file" | "image" | "media";

/** Returns an Arabic error message, or null when the upload is acceptable. */
export function validateUpload(
	file: { name: string; size: number },
	kind: UploadKind = "file"
): string | null {
	const extension = getExtension(file.name);
	const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(extension);
	const allowed: readonly string[] =
		kind === "image"
			? ALLOWED_IMAGE_EXTENSIONS
			: kind === "media"
				? [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS]
				: ALLOWED_FILE_EXTENSIONS;
	const maxBytes =
		kind === "file" || (kind === "media" && isVideo)
			? MAX_UPLOAD_BYTES
			: MAX_IMAGE_BYTES;

	if (!Number.isFinite(file.size) || file.size <= 0) return "الملف فارغ";
	if (!allowed.includes(extension)) {
		return `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowed.join("، ")}`;
	}
	if (file.size > maxBytes) {
		return `حجم الملف يتجاوز الحد المسموح (${Math.round(maxBytes / 1024 / 1024)} ميغابايت)`;
	}
	return null;
}
