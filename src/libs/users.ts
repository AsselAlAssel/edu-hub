import { listPaidUnits } from "./access";
import { prisma } from "./prismaDb";
import {
	monthStarts,
	newUsersSince,
	usersOrderBy,
	usersWhere,
	type UsersQuery,
} from "./userQuery";

/** Fields safe to send to the admin UI — never the password hash or reset tokens. */
export const publicUserSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
	image: true,
	createdAt: true,
	unlockedUnitIds: true,
} as const;

export const listUsers = () =>
	prisma.user.findMany({
		select: publicUserSelect,
		orderBy: { createdAt: "desc" },
	});

export type PublicUser = Awaited<ReturnType<typeof listUsers>>[number];

const onSaleUnitIds = async () =>
	(await listPaidUnits()).flatMap((group) => group.units.map(({ id }) => id));

/** One page of users; a page past the end returns the last page. */
export async function listUsersPage(query: UsersQuery) {
	const where = usersWhere(
		query,
		query.subscription === "PAID" ? await onSaleUnitIds() : []
	);
	const total = await prisma.user.count({ where });
	const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
	const page = Math.min(query.page, pageCount);
	const users = await prisma.user.findMany({
		where,
		select: publicUserSelect,
		orderBy: usersOrderBy(query.sort),
		skip: (page - 1) * query.pageSize,
		take: query.pageSize,
	});
	return { users, total, page, pageSize: query.pageSize };
}

export type UsersPage = Awaited<ReturnType<typeof listUsersPage>>;

/** Headline numbers + sign-ups for each of the last 6 calendar months. */
export async function getUserStats(now = Date.now()) {
	const starts = monthStarts(now);
	const [total, admins, newLast30, ...monthly] = await Promise.all([
		prisma.user.count(),
		prisma.user.count({ where: { role: "ADMIN" } }),
		prisma.user.count({ where: { createdAt: { gte: newUsersSince(now) } } }),
		...starts.slice(0, -1).map((start, index) =>
			prisma.user.count({
				where: { createdAt: { gte: start, lt: starts[index + 1] } },
			})
		),
	]);
	return {
		total,
		admins,
		students: total - admins,
		newLast30,
		monthly: starts
			.slice(0, -1)
			.map((start, index) => ({ start, count: monthly[index] })),
	};
}

export type UserStats = Awaited<ReturnType<typeof getUserStats>>;

export const ROLES = ["ADMIN", "USER"] as const;
export type RoleName = (typeof ROLES)[number];
