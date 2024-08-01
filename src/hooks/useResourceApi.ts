import { Folder, Resource } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";

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
	const { data, isLoading, mutate } = useSWR(
		folderId ? `/api/resources/${folderId}` : null,
		getResources,
		{
			fallbackData: resources,
		}
	);

	return {
		data,
		isLoading,
		mutate,
	};
};
