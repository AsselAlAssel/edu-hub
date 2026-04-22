import type { Class } from "@prisma/client";
import {
	createClassRequest,
	deleteClassRequest,
	fetchAllClasses,
	updateClassRequest,
	type CreateClassInput,
	type DeleteClassInput,
	type UpdateClassInput,
} from "@/services/class.service";
import useSWRMutation from "swr/mutation";
import useSwr from "swr";

const createClass = async (
	_key: string,
	{ arg }: { arg: CreateClassInput }
) => {
	return createClassRequest(arg);
};

export const useCreateClass = () => {
	const { data, isMutating, trigger } = useSWRMutation(
		"/api/class",
		createClass
	);
	return { data, isMutating, trigger };
};

const updateClass = async (
	_key: string,
	{ arg }: { arg: UpdateClassInput }
) => {
	return updateClassRequest(arg);
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

const deleteClass = async (
	_key: string,
	{ arg }: { arg: DeleteClassInput }
) => {
	return deleteClassRequest(arg);
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
	return fetchAllClasses(key);
};

export const useAllClass = (classes: Class[]) => {
	const { data } = useSwr<Class[]>("/api/class", getAllClass, {
		fallbackData: classes,
	});
	return { data };
};
