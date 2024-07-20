"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isAuthorized } from "@/libs/isAuthorized";

const s3Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const acceptedTypes = ["image/png", "image/jpeg", "image/jpg"];
const maxSize = 2000000; // 2mb

export async function getSignedURL(type: string, size: number) {
	const user = await isAuthorized();

	if (!user) {
		return { failure: "not authenticated" };
	}

	if (!acceptedTypes.includes(type)) {
		return { failure: "invalid file type" };
	}

	if (size > maxSize) {
		return { failure: "file too large" };
	}

	const key = `profile-image--${user.id}`;

	const putObjectCommand = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME!,
		Key: key,
		ContentType: type,
		ContentLength: size,
		Metadata: {
			userId: user.id,
		},
	});

	const url = await getSignedUrl(
		s3Client,
		putObjectCommand,
		{ expiresIn: 60 } // 60 seconds
	);

	return { success: { url, key } };
}
