import axios from "axios";

export async function fetchResources(key: string) {
	const response = await axios.get(key);
	return response.data;
}

export type AddFileInput = {
	name: string;
	url: string;
	folderId: string;
	classId: string;
	type: string;
};

export async function postFile(key: string, arg: AddFileInput) {
	const response = await axios.post(key, arg);
	return response.data;
}

export type DeleteFileInput = { fileId: string };

export async function deleteFileRequest(key: string, arg: DeleteFileInput) {
	const response = await axios.delete(key, { data: arg });
	return response.data;
}

export type UpdateFileNameInput = { fileId: string; name: string };

export async function updateFileNameRequest(
	key: string,
	arg: UpdateFileNameInput
) {
	const response = await axios.put(key, arg);
	return response.data;
}

export type AddVideoInput = {
	name: string;
	url: string;
	folderId: string;
	classId: string;
	videoId: string;
};

export async function postVideo(key: string, arg: AddVideoInput) {
	const response = await axios.post(key, arg);
	return response.data;
}

export type UpdateVideoNameInput = { videoId: string; name: string };

export async function updateVideoNameRequest(
	key: string,
	arg: UpdateVideoNameInput
) {
	const response = await axios.put(key, arg);
	return response.data;
}

export type DeleteVideoInput = { videoId: string };

export async function deleteVideoRequest(key: string, arg: DeleteVideoInput) {
	const response = await axios.delete(key, { data: arg });
	return response.data;
}
