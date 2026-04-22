import type { Class } from "@prisma/client";
import axios from "axios";

export type CreateClassInput = {
	name: string;
	description?: string;
	image?: string;
};

export type UpdateClassInput = {
	id: string;
	name: string;
	description?: string;
	image?: string;
};

export type DeleteClassInput = {
	id: string;
};

export async function fetchAllClasses(key: string): Promise<Class[]> {
	const response = await axios.get(key);
	return response.data;
}

export async function createClassRequest(arg: CreateClassInput) {
	const response = await axios.post("/api/class", arg);
	return response.data;
}

export async function updateClassRequest(arg: UpdateClassInput) {
	const response = await axios.put("/api/class", arg);
	return response.data;
}

export async function deleteClassRequest(arg: DeleteClassInput) {
	const response = await axios.delete("/api/class", { data: arg });
	return response.data;
}
