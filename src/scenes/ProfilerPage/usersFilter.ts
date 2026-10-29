import type { PublicUser, RoleName } from "@/libs/users";

export type RoleFilter = "ALL" | RoleName;
export type JoinedFilter = "ALL" | "7" | "30";
export type SortKey = "newest" | "oldest" | "name";
export type SubscriptionFilter = "ALL" | "PAID";
export type UserFilters = {
	query: string;
	role: RoleFilter;
	joined: JoinedFilter;
	sort: SortKey;
	/** PAID: students with at least one unlocked unit. */
	subscription?: SubscriptionFilter;
};

/**
 * Units the student owns that are still on sale. Ids of units since deleted
 * or made free stay in the DB (harmless: they open nothing) but don't count.
 */
export const unitCount = (
	user: Pick<PublicUser, "unlockedUnitIds">,
	onSale: Pick<ReadonlySet<string>, "has">
) => (user.unlockedUnitIds ?? []).filter((id) => onSale.has(id)).length;

const DAY = 86_400_000;

export const roleOf = (user: Pick<PublicUser, "role">): RoleName =>
	user.role === "ADMIN" ? "ADMIN" : "USER";

// createdAt arrives as an ISO string over JSON despite the Date type.
const joinedAt = (user: Pick<PublicUser, "createdAt">) =>
	new Date(user.createdAt).getTime();

export function filterUsers(
	users: PublicUser[],
	{ query, role, joined, sort, subscription = "ALL" }: UserFilters,
	now = Date.now(),
	onSale: Pick<ReadonlySet<string>, "has"> = new Set()
) {
	const q = query.trim().toLowerCase();
	const since = joined === "ALL" ? -Infinity : now - Number(joined) * DAY;
	return users
		.filter(
			(user) =>
				(!q ||
					user.email?.toLowerCase().includes(q) ||
					user.name?.toLowerCase().includes(q)) &&
				(role === "ALL" || roleOf(user) === role) &&
				(subscription === "ALL" || unitCount(user, onSale) > 0) &&
				joinedAt(user) >= since
		)
		.sort((a, b) =>
			sort === "name"
				? (a.name || a.email || "").localeCompare(b.name || b.email || "", "ar")
				: sort === "oldest"
					? joinedAt(a) - joinedAt(b)
					: joinedAt(b) - joinedAt(a)
		);
}

/** Headline numbers + sign-ups for each of the last `months` calendar months. */
export function userStats(users: PublicUser[], now = Date.now(), months = 6) {
	const today = new Date(now);
	const buckets = Array.from({ length: months }, (_, index) => {
		const start = new Date(
			today.getFullYear(),
			today.getMonth() - (months - 1 - index),
			1
		);
		return { start, count: 0 };
	});
	let admins = 0;
	let newLast30 = 0;
	for (const user of users) {
		const time = joinedAt(user);
		if (roleOf(user) === "ADMIN") admins++;
		if (time >= now - 30 * DAY) newLast30++;
		const date = new Date(time);
		const bucket = buckets.find(
			({ start }) =>
				start.getFullYear() === date.getFullYear() &&
				start.getMonth() === date.getMonth()
		);
		if (bucket) bucket.count++;
	}
	return {
		total: users.length,
		admins,
		students: users.length - admins,
		newLast30,
		monthly: buckets,
	};
}
