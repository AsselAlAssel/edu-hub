import { prisma } from "./prismaDb";

/** Fields safe to send to the admin UI — never the password hash or reset tokens. */
export const publicUserSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
	image: true,
	createdAt: true,
} as const;

export const listUsers = () =>
	prisma.user.findMany({
		select: publicUserSelect,
		orderBy: { createdAt: "desc" },
	});

export type PublicUser = Awaited<ReturnType<typeof listUsers>>[number];

export const ROLES = ["ADMIN", "USER"] as const;
export type RoleName = (typeof ROLES)[number];
