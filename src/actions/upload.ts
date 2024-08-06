"use server";
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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

export async function getSignedURL(type: string, size: number) {
	const user = await isAuthorized();

	if (!user) {
		return { failure: "not authenticated" };
	}

	const key = `${new Date().getTime()}`;

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

export const deleteObjectFromR2 = async (key: string) => {
	const deleteParams = {
		Bucket: process.env.R2_BUCKET_NAME!,
		Key: key,
	};

	try {
		const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
		console.log("Success", data);
		return data;
	} catch (err) {
		console.log("Error", err);
		throw new Error("Failed to delete object");
	}
};
