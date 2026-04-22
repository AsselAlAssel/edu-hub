import axios from "axios";

export type CreateFolderInput = {
	name: string;
	parentFolderId: string;
	classId: string;
};

export type UpdateFolderInput = {
	name: string;
	parentFolderId: string;
	classId: string;
};

export type DeleteFolderInput = {
	folderId: string;
};

export async function createFolderRequest(arg: CreateFolderInput) {
	const response = await axios.post("/api/folder", arg);
	return response.data;
}

export async function updateFolderRequest(arg: UpdateFolderInput) {
	const response = await axios.put("/api/folder", arg);
	return response.data;
}

export async function deleteFolderRequest(arg: DeleteFolderInput) {
	const response = await axios.delete("/api/folder", { data: arg });
	return response.data;
}
