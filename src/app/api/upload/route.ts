import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/libs/prismaDb";

export async function POST(req: NextRequest) {
	try {
		// Parse the form data
		const formData = await req.formData();
		const file = formData.get("file") as Blob;
		const folderId = formData.get("folderId") as string;
		const classId = formData.get("classId") as string;
		const type = formData.get("type") as string;

		if (!file) {
			return NextResponse.json({ error: "No file found" }, { status: 400 });
		}

		const fileName = (file as File).name;

		// Convert the file Blob to a Buffer for Axios
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload to Bunny CDN
		const response = await axios.put(
			`https://${(process.env.NEXT_BUNNYCDN_BASE_HOSTNAME =
				"storage.bunnycdn.com")}/${
				process.env.NEXT_BUNNYCDN_STORAGE_ZONE_NAME
			}/${fileName}`,
			buffer,
			{
				headers: {
					"Content-Type": "application/octet-stream",
					AccessKey: process.env.NEXT_BUNNYCDN_FILE_ACCESS_KEY,
				},
			}
		);
		const url = `https://${process.env.NEXT_BUNNYCDN_PULL_ZONE_NAME}.b-cdn.net/${fileName}`;
		await prisma.file.create({
			data: {
				name: fileName,
				url: url,
				folderId: folderId,
				classId: classId,
				type: type,
			},
		});

		if (response.status === 200) {
			return NextResponse.json(
				{ message: "File uploaded to Bunny CDN successfully" },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ error: "Failed to upload file to Bunny CDN" },
				{ status: response.status }
			);
		}
	} catch (error) {
		console.error("Error uploading file to Bunny CDN:", error);
		return NextResponse.json(
			{ error: "An error occurred while uploading the file" },
			{ status: 500 }
		);
	}
}

// //  for video upload
