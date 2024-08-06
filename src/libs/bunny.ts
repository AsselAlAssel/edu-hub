import axios from "axios";

// create folder storage
export const createFolder = async (folderName: string, path: string) => {
	const encodedFolderName = encodeURIComponent(folderName);
	const url = `https://storage.bunnycdn.com/${process.env.NEXT_BUNNYCDN_STORAGE_ZONE_NAME}/${path}${encodedFolderName}/`;
	const response = await axios.put(url, null, {
		headers: {
			AccessKey: process.env.NEXT_BUNNYCDN_FILE_ACCESS_KEY,
		},
	});

	return response.data;
};

export const createVideoCollection = async (folderName: string) => {
	const url = `https://video.bunnycdn.com/library/${process.env.NEXT_BUNNYCDN_LIBRARY_ID}/collections`;
	const response = await axios.post(
		url,
		{
			name: folderName,
		},
		{
			headers: {
				AccessKey: process.env.NEXT_BUNNYCDN_VIDEOS_ACCESS_KEY,
			},
		}
	);
	return response.data;
};

// export const createVideo = async (folderName: string, videoName: string) => {
