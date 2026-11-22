// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, crumbs } = vi.hoisted(() => ({
	prisma: { folder: { findUnique: vi.fn() }, user: { findUnique: vi.fn() } },
	crumbs: {
		current: null as null | { id: string; name: string; price?: number }[],
	},
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => null) }));
vi.mock("@/libs/folder", () => ({
	getBreadcrumbs: vi.fn(async () => crumbs.current),
}));

import {
	canOpenUnit,
	getUnit,
	unitAccessEnd,
	unitAccessEndInYear,
	unitAccessEndOn,
} from "@/libs/access";
import { isBunnyUrl, parseBunnyUrl } from "@/libs/bunnyUrl";

const GUID = "594324c9-0b1e-48cc-945a-f1bd20716fc0";
const ROOT = "a".repeat(24);
const UNIT = "b".repeat(24);
const LESSON = "c".repeat(24);

describe("parseBunnyUrl", () => {
	it.each([
		`https://iframe.mediadelivery.net/embed/789604/${GUID}`,
		`https://player.mediadelivery.net/embed/789604/${GUID}?autoplay=true`,
		`https://iframe.mediadelivery.net/play/789604/${GUID}`,
		`https://player.mediadelivery.net/play/789604/${GUID}`,
	])("accepts %s", (url) => {
		expect(parseBunnyUrl(url)).toEqual({ libraryId: "789604", videoId: GUID });
		expect(isBunnyUrl(url)).toBe(true);
	});

	it.each([
		"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		`https://evil.example/embed/789604/${GUID}`,
		`https://iframe.mediadelivery.net.evil.example/embed/789604/${GUID}`,
		"not a url",
		"",
	])("rejects %s", (url) => {
		expect(parseBunnyUrl(url)).toBeNull();
		expect(isBunnyUrl(url)).toBe(false);
	});
});

describe("canOpenUnit", () => {
	const paid = { id: UNIT, name: "الوحدة 1", price: 100 };
	const student = {
		id: "u",
		email: null,
		role: "USER",
		unlockedUnitIds: [] as string[],
		unitGrants: [],
	};

	it("opens anything outside a paid unit", () => {
		expect(canOpenUnit(null, null)).toBe(true);
		expect(canOpenUnit(null, { ...paid, price: null })).toBe(true);
	});

	it("locks a paid unit for guests and strangers", () => {
		expect(canOpenUnit(null, paid)).toBe(false);
		expect(canOpenUnit(student, paid)).toBe(false);
	});

	it("opens a paid unit for its owners and admins", () => {
		expect(canOpenUnit({ ...student, unlockedUnitIds: [UNIT] }, paid)).toBe(
			true
		);
		expect(canOpenUnit({ ...student, role: "ADMIN" }, paid)).toBe(true);
	});
});

describe("getUnit", () => {
	beforeEach(() => {
		prisma.folder.findUnique.mockClear();
	});

	it("is null for the class root and unknown folders", async () => {
		crumbs.current = [{ id: ROOT, name: "root" }];
		expect(await getUnit(ROOT)).toBeNull();
		crumbs.current = null;
		expect(await getUnit(ROOT)).toBeNull();
	});

	it("resolves any depth to the first-level folder", async () => {
		crumbs.current = [
			{ id: ROOT, name: "root" },
			{ id: UNIT, name: "الوحدة 1", price: 100 },
			{ id: LESSON, name: "الدرس 1" },
		];
		expect(await getUnit(LESSON)).toEqual({
			id: UNIT,
			name: "الوحدة 1",
			price: 100,
		});
		// The price rides on the breadcrumb walk: no extra query.
		expect(prisma.folder.findUnique).not.toHaveBeenCalled();
	});
});

describe("unit access cutoff (31/8, 23:59 Jerusalem)", () => {
	it("closes on 31 August of the year after opening", () => {
		expect(unitAccessEnd(new Date("2026-11-22T08:00:00Z")).toISOString()).toBe(
			"2027-08-31T20:59:00.000Z"
		);
		expect(unitAccessEnd(new Date("2027-03-01T08:00:00Z")).toISOString()).toBe(
			"2028-08-31T20:59:00.000Z"
		);
	});

	it("uses the Jerusalem year at the new year boundary", () => {
		// 31/12/2026 23:30 UTC is already 1/1/2027 in Jerusalem.
		expect(unitAccessEnd(new Date("2026-12-31T23:30:00Z")).toISOString()).toBe(
			"2028-08-31T20:59:00.000Z"
		);
		expect(unitAccessEndInYear(2027).toISOString()).toBe(
			"2027-08-31T20:59:00.000Z"
		);
	});

	it("reads admin days as 23:59 Jerusalem, summer and winter", () => {
		expect(unitAccessEndOn("2027-06-30")?.toISOString()).toBe(
			"2027-06-30T20:59:00.000Z"
		);
		expect(unitAccessEndOn("2027-01-15")?.toISOString()).toBe(
			"2027-01-15T21:59:00.000Z"
		);
		for (const bad of ["2027-02-30", "2027-6-30", "", null, 5]) {
			expect(unitAccessEndOn(bad)).toBeNull();
		}
	});
});
