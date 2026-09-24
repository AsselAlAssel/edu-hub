import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
	},
});

/** Object key of a file we stored, or null for foreign/closed URLs. */
export const r2KeyFromUrl = (url: string) => {
	const base = process.env.NEXT_PUBLIC_FILES_URL;
	if (!base || !url.startsWith(`${base}/`)) return null;
	const key = url.slice(base.length + 1);
	return key && !key.includes("/") ? key : null;
};

/** Best-effort removal; a storage failure must not block the DB delete. */
export async function deleteR2Object(key: string) {
	try {
		await r2Client.send(
			new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key })
		);
	} catch (error) {
		console.error("R2 delete failed:", error);
	}
}
