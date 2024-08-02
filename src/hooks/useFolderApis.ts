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
