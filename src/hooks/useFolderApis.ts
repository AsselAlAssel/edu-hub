import axios from "axios";
import useSWRMutation from "swr/mutation";

const createFolder = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			parentFolderId: string;
			classId: string;
		};
	}
) => {
	const response = await axios.post("/api/folder", arg);
	return response.data;
};
export const useCreateFolder = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		createFolder
	);
	return { data, isCreatingFolder: isMutating, createFolder: trigger };
};

// update folder name
const updateFolderName = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			parentFolderId: string;
			classId: string;
		};
	}
) => {
	const response = await axios.put("/api/folder", arg);
	return response.data;
};
export const useUpdateFolderName = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		updateFolderName
	);
	return { data, isUpdatingFolder: isMutating, updateFolderName: trigger };
};
3;

const deleteFolder = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			folderId: string;
		};
	}
) => {
	const response = await axios.delete("/api/folder", { data: arg });
	return response.data;
};

export const useDeleteFolder = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		deleteFolder
	);
	return { data, isDeletingFolder: isMutating, deleteFolder: trigger };
};
