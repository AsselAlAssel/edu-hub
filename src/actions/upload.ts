"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { getSessionUser } from "@/libs/api";
import { r2Client } from "@/libs/r2";
import { type UploadKind, validateUpload } from "@/libs/uploadRules";

/**
 * Presigned PUT URL for R2. Admin-only: every upload surface (resources,
 * class images, landing CMS) is an admin tool. The signed ContentLength
 * makes R2 reject bodies that differ from the validated size.
 */
export async function getSignedURL(
	file: { name: string; type: string; size: number },
	kind: UploadKind = "file"
) {
	const user = await getSessionUser();
	if (!user) return { failure: "يجب تسجيل الدخول أولاً" };
	if (user.role !== "ADMIN") return { failure: "غير مصرح لك برفع الملفات" };

	const invalid = validateUpload(file, kind);
	if (invalid) return { failure: invalid };

	const key = `${Date.now()}-${randomUUID()}`;
	const url = await getSignedUrl(
		r2Client,
		new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: key,
			ContentType: file.type || "application/octet-stream",
			ContentLength: file.size,
			Metadata: { userId: user.id },
		}),
		{ expiresIn: 60 }
	);

	return { success: { url, key } };
}
