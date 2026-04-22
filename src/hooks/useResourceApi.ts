import type { File, Folder, Video } from "@prisma/client";
import {
	deleteFileRequest,
	deleteVideoRequest,
	fetchResources,
	postFile,
	postVideo,
	updateFileNameRequest,
	updateVideoNameRequest,
	type AddFileInput,
	type AddVideoInput,
	type DeleteFileInput,
	type DeleteVideoInput,
	type UpdateFileNameInput,
	type UpdateVideoNameInput,
} from "@/services/resource.service";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const getResources = async (key: string) => {
	return fetchResources(key);
};

export const useResource = ({
	folderId,
	resources,
}: {
	folderId: string;
	resources: {
		folders: Folder[];
		files: File[];
		videos: Video[];
	};
}) => {
	const { data, isLoading, mutate } = useSWR<
		{
			folders: Folder[];
			files: File[];
			videos: Video[];
		},
		any
	>(folderId ? `/api/resources/${folderId}` : null, getResources, {
		fallbackData: resources,
	});

	return {
		data,
		isLoading,
		mutate,
	};
};

const addFile = async (_key: string, { arg }: { arg: AddFileInput }) => {
	return postFile(_key, arg);
};

export const useAddFile = () => {
	const { isMutating: isLoading, trigger: addFileMutation } = useSWRMutation(
		"/api/file",
		addFile
	);

	return {
		isLoading,
		addFile: addFileMutation,
	};
};

const deleteFile = async (_key: string, { arg }: { arg: DeleteFileInput }) => {
	return deleteFileRequest(_key, arg);
};

export const useDeleteFile = () => {
	const { isMutating: isLoading, trigger: deleteFileMutation } = useSWRMutation(
		"/api/file",
		deleteFile
	);

	return {
		isLoading,
		deleteFile: deleteFileMutation,
	};
};

const updateFileName = async (
	_key: string,
	{ arg }: { arg: UpdateFileNameInput }
) => {
	return updateFileNameRequest(_key, arg);
};

export const useUpdateFileName = () => {
	const { isMutating: isLoading, trigger: updateFileNameMutation } =
		useSWRMutation("/api/file", updateFileName);

	return {
		isLoading,
		updateFileName: updateFileNameMutation,
	};
};

const addVideo = async (_key: string, { arg }: { arg: AddVideoInput }) => {
	return postVideo(_key, arg);
};

export const useAddVideo = () => {
	const { isMutating: isLoading, trigger: addVideoMutation } = useSWRMutation(
		"/api/video",
		addVideo
	);

	return {
		isLoading,
		addVideo: addVideoMutation,
	};
};

const updateVideoName = async (
	_key: string,
	{ arg }: { arg: UpdateVideoNameInput }
) => {
	return updateVideoNameRequest(_key, arg);
};

export const useUpdateVideoName = () => {
	const { isMutating: isLoading, trigger: updateVideoNameMutation } =
		useSWRMutation("/api/video", updateVideoName);

	return {
		isLoading,
		updateVideoName: updateVideoNameMutation,
	};
};

const deleteVideo = async (
	_key: string,
	{ arg }: { arg: DeleteVideoInput }
) => {
	return deleteVideoRequest(_key, arg);
};

export const useDeleteVideo = () => {
	const { isMutating: isLoading, trigger: deleteVideoMutation } =
		useSWRMutation("/api/video", deleteVideo);

	return {
		isLoading,
		deleteVideo: deleteVideoMutation,
	};
};
