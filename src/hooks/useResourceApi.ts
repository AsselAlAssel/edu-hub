import { File, Folder, Video } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const getResources = async (key: string) => {
	const response = await axios.get(key);
	return response.data;
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

const addFile = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			url: string;
			folderId: string;
			classId: string;
			type: string;
		};
	}
) => {
	const response = await axios.post(key, arg);
	return response.data;
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

const deleteFile = async (
	key: string,
	{ arg }: { arg: { fileId: string } }
) => {
	const response = await axios.delete(key, { data: arg });
	return response.data;
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
	key: string,
	{ arg }: { arg: { fileId: string; name: string } }
) => {
	const response = await axios.put(key, arg);
	return response.data;
};
export const useUpdateFileName = () => {
	const { isMutating: isLoading, trigger: updateFileNameMutation } =
		useSWRMutation("/api/file", updateFileName);

	return {
		isLoading,
		updateFileName: updateFileNameMutation,
	};
};

const addVideo = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			url: string;
			folderId: string;
			classId: string;
			videoId: string;
		};
	}
) => {
	const response = await axios.post(key, arg);
	return response.data;
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
	key: string,
	{ arg }: { arg: { videoId: string; name: string } }
) => {
	const response = await axios.put(key, arg);
	return response.data;
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
	key: string,
	{ arg }: { arg: { videoId: string } }
) => {
	const response = await axios.delete(key, { data: arg });
	return response.data;
};

export const useDeleteVideo = () => {
	const { isMutating: isLoading, trigger: deleteVideoMutation } =
		useSWRMutation("/api/video", deleteVideo);

	return {
		isLoading,
		deleteVideo: deleteVideoMutation,
	};
};
