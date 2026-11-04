import type { Prisma } from "@prisma/client";
import type { RoleName } from "./users";

export type RoleFilter = "ALL" | RoleName;
export type JoinedFilter = "ALL" | "7" | "30";
export type SortKey = "newest" | "oldest" | "name";
export type SubscriptionFilter = "ALL" | "PAID";
export type UserFilters = {
	query: string;
	role: RoleFilter;
	joined: JoinedFilter;
	sort: SortKey;
	/** PAID: students with at least one unit still on sale. */
	subscription: SubscriptionFilter;
};
export type UsersQuery = UserFilters & { page: number; pageSize: number };

export const DEFAULT_USER_FILTERS: UserFilters = {
	query: "",
	role: "ALL",
	joined: "ALL",
	sort: "newest",
	subscription: "ALL",
};
export const USERS_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_QUERY_LENGTH = 100;
const DAY = 86_400_000;

const oneOf = <T extends string>(
	value: string | null,
	allowed: readonly T[],
	fallback: T
): T => (allowed.includes(value as T) ? (value as T) : fallback);

const positiveInt = (value: string | null, fallback: number) => {
	const number = Number(value);
	return Number.isInteger(number) && number > 0 ? number : fallback;
};

/** Unknown or missing params fall back to the defaults instead of failing. */
export function parseUsersQuery(params: URLSearchParams): UsersQuery {
	return {
		query: (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH),
		role: oneOf(params.get("role"), ["ALL", "ADMIN", "USER"], "ALL"),
		joined: oneOf(params.get("joined"), ["ALL", "7", "30"], "ALL"),
		sort: oneOf(params.get("sort"), ["newest", "oldest", "name"], "newest"),
		subscription: oneOf(params.get("subscription"), ["ALL", "PAID"], "ALL"),
		page: positiveInt(params.get("page"), 1),
		pageSize: Math.min(
			positiveInt(params.get("pageSize"), USERS_PAGE_SIZE),
			MAX_PAGE_SIZE
		),
	};
}

export function usersQueryString({
	query,
	role,
	joined,
	sort,
	subscription,
	page,
	pageSize,
}: UsersQuery) {
	const params = new URLSearchParams({
		page: String(page),
		pageSize: String(pageSize),
	});
	if (query.trim()) params.set("q", query.trim());
	if (role !== "ALL") params.set("role", role);
	if (joined !== "ALL") params.set("joined", joined);
	if (sort !== "newest") params.set("sort", sort);
	if (subscription !== "ALL") params.set("subscription", subscription);
	return params.toString();
}

/** A missing or null role counts as a student, like `roleOf`. */
const STUDENT_ROLE: Prisma.UserWhereInput = {
	OR: [{ role: { not: "ADMIN" } }, { role: null }, { role: { isSet: false } }],
};

/** `onSaleIds`: units still on sale; ids of deleted or free units don't count. */
export function usersWhere(
	{ query, role, joined, subscription }: UserFilters,
	onSaleIds: string[],
	now = Date.now()
): Prisma.UserWhereInput {
	const and: Prisma.UserWhereInput[] = [];
	if (query) {
		and.push({
			OR: [
				{ name: { contains: query, mode: "insensitive" } },
				{ email: { contains: query, mode: "insensitive" } },
			],
		});
	}
	if (role === "ADMIN") and.push({ role: "ADMIN" });
	if (role === "USER") and.push(STUDENT_ROLE);
	if (joined !== "ALL") {
		and.push({ createdAt: { gte: new Date(now - Number(joined) * DAY) } });
	}
	if (subscription === "PAID") {
		and.push(
			onSaleIds.length
				? { unlockedUnitIds: { hasSome: onSaleIds } }
				: { id: { in: [] } }
		);
	}
	return and.length ? { AND: and } : {};
}

// The id tiebreak keeps pages stable when several users share a value.
export function usersOrderBy(
	sort: SortKey
): Prisma.UserOrderByWithRelationInput[] {
	if (sort === "name")
		return [{ name: "asc" }, { email: "asc" }, { id: "asc" }];
	const direction = sort === "oldest" ? "asc" : "desc";
	return [{ createdAt: direction }, { id: direction }];
}

/**
 * First day of each of the last `months` calendar months, oldest first, then
 * the first day of next month (where the last bucket ends).
 */
export function monthStarts(now = Date.now(), months = 6) {
	const today = new Date(now);
	return Array.from(
		{ length: months + 1 },
		(_, index) =>
			new Date(today.getFullYear(), today.getMonth() - (months - 1 - index), 1)
	);
}

export const newUsersSince = (now = Date.now()) => new Date(now - 30 * DAY);
