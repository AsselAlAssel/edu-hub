"use server";
import { prisma } from "@/libs/prismaDb";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/libs/isAuthorized";

export async function getApiKeys() {
	const user = await isAuthorized();
	const res = await prisma.apiKey.findMany({
		where: {
			userId: user?.id as string,
		},
	});
	return res;
}

export async function createApiKey(keyName: string) {
	const user = await isAuthorized();

	if (!user) {
		return null;
	}

	const key = user.role as string;

	// Hash the key
	const hashedKey = await bcrypt.hash(key, 10);

	await prisma.apiKey.create({
		data: {
			name: keyName,
			key: hashedKey,
			userId: user.id,
		},
	});

	revalidatePath("/admin/api");
}

export async function deleteApiKey(id: string) {
	const res = await prisma.apiKey.delete({
		where: {
			id,
		},
	});

	revalidatePath("/admin/api");
	return res;
}
