import { Folder, Resource } from "@prisma/client";
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
		resources: Resource[];
	};
}) => {
	const { data, isLoading, mutate } = useSWR<
		{
			folders: Folder[];
			resources: Resource[];
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

const uploadFiles = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			file: FormData;
		};
	}
) => {
	const response = await axios.post("/api/upload", arg.file);
	return response.data;
};
export const useUploadFile = () => {
	const { isMutating: isLoading, trigger: upload } = useSWRMutation(
		"/api/upload",
		uploadFiles
	);

	return {
		isLoading,
		upload,
	};
};

const uploadVideo = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			file: FormData;
		};
	}
) => {
	const response = await axios.post("/api/upload/video", arg.file);
	return response.data;
};

export const useUploadVideo = () => {
	const { isMutating: isLoading, trigger: upload } = useSWRMutation(
		"/api/upload/video",
		uploadVideo
	);

	return {
		isLoading,
		upload,
	};
};
