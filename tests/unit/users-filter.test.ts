// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { PublicUser } from "@/libs/users";
import {
	DEFAULT_USER_FILTERS,
	monthStarts,
	parseUsersQuery,
	usersOrderBy,
	usersQueryString,
	usersWhere,
} from "@/libs/userQuery";
import { roleOf, unitCount } from "@/scenes/ProfilerPage/usersFilter";

const NOW = new Date(2026, 9, 21).getTime();
const page = { page: 1, pageSize: 10 };

describe("parseUsersQuery", () => {
	it("falls back to defaults for missing or unknown params", () => {
		expect(
			parseUsersQuery(
				new URLSearchParams("role=OWNER&sort=x&page=-2&pageSize=abc")
			)
		).toEqual({ ...DEFAULT_USER_FILTERS, ...page });
	});

	it("caps the page size and trims the search", () => {
		const query = parseUsersQuery(
			new URLSearchParams("q=  sami &pageSize=5000&page=3&role=USER")
		);
		expect(query).toMatchObject({
			query: "sami",
			pageSize: 100,
			page: 3,
			role: "USER",
		});
	});

	it("round-trips with usersQueryString", () => {
		const query = {
			query: "ali",
			role: "ADMIN",
			joined: "30",
			sort: "name",
			subscription: "PAID",
			page: 2,
			pageSize: 10,
		} as const;
		expect(
			parseUsersQuery(new URLSearchParams(usersQueryString(query)))
		).toEqual(query);
		// Defaults stay out of the URL (one SWR key per real query).
		expect(usersQueryString({ ...DEFAULT_USER_FILTERS, ...page })).toBe(
			"page=1&pageSize=10"
		);
	});
});

describe("usersWhere", () => {
	it("is empty without filters", () => {
		expect(usersWhere(DEFAULT_USER_FILTERS, [], NOW)).toEqual({});
	});

	it("searches name or email case-insensitively and counts a null role as student", () => {
		const where = usersWhere(
			{ ...DEFAULT_USER_FILTERS, query: "ran", role: "USER" },
			[],
			NOW
		);
		expect(where.AND).toEqual([
			{
				OR: [
					{ name: { contains: "ran", mode: "insensitive" } },
					{ email: { contains: "ran", mode: "insensitive" } },
				],
			},
			{
				OR: [
					{ role: { not: "ADMIN" } },
					{ role: null },
					{ role: { isSet: false } },
				],
			},
		]);
	});

	it("filters by join window and by units still on sale", () => {
		expect(
			usersWhere(
				{ ...DEFAULT_USER_FILTERS, joined: "7", subscription: "PAID" },
				["u1"],
				NOW
			).AND
		).toEqual([
			{ createdAt: { gte: new Date(NOW - 7 * 86_400_000) } },
			{ unlockedUnitIds: { hasSome: ["u1"] } },
		]);
		// Nothing on sale: no subscribers.
		expect(
			usersWhere({ ...DEFAULT_USER_FILTERS, subscription: "PAID" }, [], NOW).AND
		).toEqual([{ id: { in: [] } }]);
	});
});

describe("usersOrderBy", () => {
	it("breaks ties by id so pages never repeat or skip users", () => {
		expect(usersOrderBy("newest")).toEqual([
			{ createdAt: "desc" },
			{ id: "desc" },
		]);
		expect(usersOrderBy("oldest")).toEqual([
			{ createdAt: "asc" },
			{ id: "asc" },
		]);
		expect(usersOrderBy("name").at(-1)).toEqual({ id: "asc" });
	});
});

describe("monthStarts", () => {
	it("returns the last 6 month starts plus next month as the end", () => {
		const starts = monthStarts(NOW);
		expect(starts).toHaveLength(7);
		expect(starts[0]).toEqual(new Date(2026, 4, 1));
		expect(starts[5]).toEqual(new Date(2026, 9, 1));
		expect(starts[6]).toEqual(new Date(2026, 10, 1));
	});
});

describe("unitCount and roleOf", () => {
	it("counts only units still on sale; a missing role is a student", () => {
		const user = { unlockedUnitIds: ["u1", "gone"] } as PublicUser;
		expect(unitCount(user, new Set(["u1"]))).toBe(1);
		expect(roleOf({ role: null } as PublicUser)).toBe("USER");
		expect(roleOf({ role: "ADMIN" } as PublicUser)).toBe("ADMIN");
	});
});
