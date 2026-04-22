import {
	createFolderRequest,
	deleteFolderRequest,
	updateFolderRequest,
	type CreateFolderInput,
	type DeleteFolderInput,
	type UpdateFolderInput,
} from "@/services/folder.service";
import useSWRMutation from "swr/mutation";

const createFolder = async (
	_key: string,
	{ arg }: { arg: CreateFolderInput }
) => {
	return createFolderRequest(arg);
};

export const useCreateFolder = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		createFolder
	);
	return { data, isCreatingFolder: isMutating, createFolder: trigger };
};

const updateFolderName = async (
	_key: string,
	{ arg }: { arg: UpdateFolderInput }
) => {
	return updateFolderRequest(arg);
};

export const useUpdateFolderName = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		updateFolderName
	);
	return { data, isUpdatingFolder: isMutating, updateFolderName: trigger };
};

const deleteFolder = async (
	_key: string,
	{ arg }: { arg: DeleteFolderInput }
) => {
	return deleteFolderRequest(arg);
};

export const useDeleteFolder = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/folder",
		deleteFolder
	);
	return { data, isDeletingFolder: isMutating, deleteFolder: trigger };
};
