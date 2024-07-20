"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";

export async function getUsers(filter: any) {
	const currentUser = await isAuthorized();

	const res = await prisma.user.findMany({
		where: {
			role: filter,
		},
	});

	const filtredUsers = res.filter(
		(user) =>
			user.email !== currentUser?.email && !user.email?.includes("demo-")
	);

	return filtredUsers;
}

export async function updateUser(data: any) {
	const { email } = data;
	return await prisma.user.update({
		where: {
			email: email.toLowerCase(),
		},
		data: {
			email: email.toLowerCase(),
			...data,
		},
	});
}

export async function deleteUser(user: any) {
	if (user?.email?.includes("demo-")) {
		return new Error("Can't delete demo user");
	}

	if (!user) {
		return new Error("User not found");
	}

	return await prisma.user.delete({
		where: {
			email: user?.email.toLowerCase() as string,
		},
	});
}

export async function serchUser(email: string) {
	return await prisma.user.findUnique({
		where: {
			email: email.toLowerCase(),
		},
	});
}
