// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, crumbs } = vi.hoisted(() => ({
	prisma: { folder: { findUnique: vi.fn() }, user: { findUnique: vi.fn() } },
	crumbs: { current: null as null | { id: string; name: string }[] },
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => null) }));
vi.mock("@/libs/folder", () => ({
	getBreadcrumbs: vi.fn(async () => crumbs.current),
}));

import { canOpenUnit, getUnit } from "@/libs/access";
import { isBunnyUrl, parseBunnyUrl } from "@/libs/bunny";

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
	const student = { id: "u", role: "USER", unlockedUnitIds: [] as string[] };

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
		prisma.folder.findUnique.mockResolvedValue({ price: 100 });
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
			{ id: UNIT, name: "الوحدة 1" },
			{ id: LESSON, name: "الدرس 1" },
		];
		expect(await getUnit(LESSON)).toEqual({
			id: UNIT,
			name: "الوحدة 1",
			price: 100,
		});
		expect(prisma.folder.findUnique).toHaveBeenCalledWith({
			where: { id: UNIT },
			select: { price: true },
		});
	});
});
