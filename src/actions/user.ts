"use server";
// Legacy actions used only by the unreachable src/components/Admin/Users
// template. Server actions are public endpoints, so each one is admin-gated
// and never returns credentials. The admin UI uses /api/user instead.
import { getSessionUser } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { publicUserSelect, ROLES, type RoleName } from "@/libs/users";

const assertAdmin = async () => {
	const me = await getSessionUser();
	if (me?.role !== "ADMIN") throw new Error("Forbidden");
	return me;
};

export async function getUsers(filter?: string) {
	const me = await assertAdmin();
	const role = ROLES.includes(filter as RoleName) ? filter : undefined;
	const users = await prisma.user.findMany({
		where: role ? { role } : undefined,
		select: publicUserSelect,
	});
	return users.filter(
		(user) => user.email !== me.email && !user.email?.includes("demo-")
	);
}

export async function updateUser(data: { email: string; role?: string }) {
	await assertAdmin();
	if (!ROLES.includes(data.role as RoleName)) throw new Error("Invalid role");
	return prisma.user.update({
		where: { email: data.email.toLowerCase() },
		data: { role: data.role },
		select: publicUserSelect,
	});
}

export async function deleteUser(user: { email?: string | null }) {
	const me = await assertAdmin();
	const email = user?.email?.toLowerCase();
	if (!email) return new Error("User not found");
	if (email.includes("demo-")) return new Error("Can't delete demo user");
	if (email === me.email?.toLowerCase()) return new Error("Forbidden");

	return prisma.user.delete({ where: { email }, select: publicUserSelect });
}

export async function serchUser(email: string) {
	await assertAdmin();
	return prisma.user.findUnique({
		where: { email: email.toLowerCase() },
		select: publicUserSelect,
	});
}
