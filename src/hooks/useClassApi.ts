import { Class } from "@prisma/client";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import useSwr from "swr";

const createClass = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			description?: string;
		};
	}
) => {
	const response = await axios.post("/api/class", arg);
	return response.data;
};

export const useCreateClass = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/class",
		createClass
	);
	return { data, isMutating, trigger };
};

const updateClass = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			id: string;
			name: string;
			description?: string;
		};
	}
) => {
	const response = await axios.put("/api/class", arg);
	return response.data;
};
export const useUpdateClass = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/class",
		updateClass
	);
	return {
		data,
		isUpdating: isMutating,
		updateClass: trigger,
	};
};

export const deleteClass = async (
	key: string,
	{
		arg,
	}: {
		arg: {
			id: string;
		};
	}
) => {
	const response = await axios.delete("/api/class", { data: arg });
	return response.data;
};

export const useDeleteClass = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/class",
		deleteClass
	);
	return {
		data,
		isDeleting: isMutating,
		deleteClass: trigger,
	};
};

export const getAllClass = async (key: string) => {
	const response = await axios.get(key);
	return response.data;
};
export const useAllClass = (classes: Class[]) => {
	const { data } = useSwr<Class[]>("/api/class", getAllClass, {
		fallbackData: classes,
	});
	return { data };
};

const getClass = async (key: string) => {
	const response = await axios.get(key);
	return response.data;
};

export const useClass = ({
	classId,
	classItem,
}: {
	classId: string;
	classItem: Class | null;
}) => {
	const { data, mutate } = useSwr<Class>(`/api/class/${classId}`, getClass, {
		fallbackData: classItem ? classItem : undefined,
	});
	return {
		data,
		mutate,
	};
};
