// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { PublicUser } from "@/libs/users";
import { filterUsers, userStats } from "@/scenes/ProfilerPage/usersFilter";

const NOW = new Date(2026, 9, 21).getTime();
const daysAgo = (days: number) => new Date(NOW - days * 86_400_000);
const user = (
	id: string,
	name: string,
	days: number,
	role: string | null = "USER",
	image: string | null = null
) =>
	({
		id,
		name,
		email: `${id}@x.com`,
		role,
		image,
		createdAt: daysAgo(days),
	}) as PublicUser;

const users = [
	user("a", "Sami", 2, "ADMIN", "https://img"),
	user("b", "Ali", 20, null),
	user("c", "Rana", 100),
];
const base = { query: "", role: "ALL", joined: "ALL", sort: "newest" } as const;

describe("filterUsers by subscription", () => {
	it("PAID keeps only students with at least one unit", () => {
		const subscriber = {
			...user("d", "Lina", 1),
			unlockedUnitIds: ["u1"],
		} as PublicUser;
		expect(
			filterUsers(
				[...users, subscriber],
				{ ...base, subscription: "PAID" },
				NOW
			).map((u) => u.id)
		).toEqual(["d"]);
		expect(filterUsers([...users, subscriber], base, NOW)).toHaveLength(4);
	});
});

describe("filterUsers", () => {
	it("filters by search, role (null role = USER) and join window", () => {
		expect(
			filterUsers(users, { ...base, query: "ran" }, NOW).map((u) => u.id)
		).toEqual(["c"]);
		expect(
			filterUsers(users, { ...base, role: "USER" }, NOW).map((u) => u.id)
		).toEqual(["b", "c"]);
		expect(
			filterUsers(users, { ...base, joined: "30" }, NOW).map((u) => u.id)
		).toEqual(["a", "b"]);
		expect(
			filterUsers(users, { ...base, joined: "7" }, NOW).map((u) => u.id)
		).toEqual(["a"]);
	});

	it("sorts and accepts ISO-string dates from JSON", () => {
		const fromJson = JSON.parse(JSON.stringify(users)) as PublicUser[];
		expect(
			filterUsers(fromJson, { ...base, sort: "oldest" }, NOW).map((u) => u.id)
		).toEqual(["c", "b", "a"]);
		expect(
			filterUsers(fromJson, { ...base, sort: "name" }, NOW).map((u) => u.id)
		).toEqual(["b", "c", "a"]);
	});
});

describe("userStats", () => {
	it("counts roles, recent sign-ups, photos and monthly buckets", () => {
		const stats = userStats(users, NOW);
		expect(stats).toMatchObject({
			total: 3,
			admins: 1,
			students: 2,
			newLast30: 2,
		});
		expect(stats.monthly).toHaveLength(6);
		expect(stats.monthly.reduce((sum, m) => sum + m.count, 0)).toBe(3);
		expect(stats.monthly.at(-1)?.start.getMonth()).toBe(9);
	});
});
