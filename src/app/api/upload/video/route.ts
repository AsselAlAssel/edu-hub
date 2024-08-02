import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_KEY = "3fb90f41-721b-4db5-aea894e9b1bb-b6aa-4174";

const libraryId = "277191";
const key = "3fb90f41-721b-4db5-aea894e9b1bb-b6aa-4174";
const createURL = `https://video.bunnycdn.com/library/${libraryId}/videos`;
const putUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/`;

export async function POST(req: NextRequest) {
	try {
		// Parse the form data
		const formData = await req.formData();
		const file = formData.get("file") as Blob;

		if (!file) {
			return NextResponse.json({ error: "No file found" }, { status: 400 });
		}

		// const fileName = (file as File).name;

		// // Convert the file Blob to a Buffer for Axios
		// const arrayBuffer = await file.arrayBuffer();
		// const buffer = Buffer.from(arrayBuffer);

		// Upload to Bunny CDN
		const response = await axios.post(
			createURL,
			// add title and description
			{
				title: "test video",
			},
			{
				headers: {
					AccessKey: key,
				},
			}
		);
		console.log(111111, response.data);
		const videoId = response.data.guid;
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Upload the file
		const uploadResponse = await axios.put(`${putUrl}${videoId}`, buffer, {
			headers: {
				AccessKey: ACCESS_KEY,
				"Content-Type": file.type,
			},
		});

		console.log(222222, uploadResponse.data);
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
