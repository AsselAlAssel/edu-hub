// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, crumbs } = vi.hoisted(() => ({
	prisma: {
		folder: { findMany: vi.fn(), findUnique: vi.fn() },
		video: { findMany: vi.fn() },
		file: { findMany: vi.fn() },
		landingPage: { findFirst: vi.fn() },
	},
	crumbs: { current: [] as { id: string; name: string }[] },
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({ getServerSession: vi.fn(async () => null) }));
vi.mock("@/libs/folder", () => ({
	getBreadcrumbs: vi.fn(async () => crumbs.current),
}));

import { getResources } from "@/libs/class";
import { PAID_FILE_URL, SIGNIN_FILE_URL } from "@/libs/constant";

const ROOT = "a".repeat(24);
const UNIT = "b".repeat(24);
const R2_URL = "https://files.example/secret.pdf";
const file = { id: "f1", name: "ورقة عمل", url: R2_URL, type: "pdf" };
const student = { id: "u", role: "USER", unlockedUnitIds: [] as string[] };

const run = (viewer?: Parameters<typeof getResources>[1]) =>
	getResources(UNIT, viewer);

beforeEach(() => {
	crumbs.current = [
		{ id: ROOT, name: "root" },
		{ id: UNIT, name: "الوحدة 1" },
	];
	prisma.folder.findMany.mockResolvedValue([]);
	prisma.video.findMany.mockResolvedValue([]);
	prisma.file.findMany.mockResolvedValue([file]);
	prisma.folder.findUnique.mockResolvedValue({ price: 100 });
	prisma.landingPage.findFirst.mockResolvedValue({
		whatsAppNumber: "970599000000",
	});
});

describe("getResources in a paid unit", () => {
	it("asks guests to sign in and never sends the file link", async () => {
		const { files, access } = await run();
		expect(files[0].url).toBe(SIGNIN_FILE_URL);
		expect(access.canOpen).toBe(false);
		expect(access.unit).toEqual({ id: UNIT, name: "الوحدة 1", price: 100 });
		expect(access.whatsAppNumber).toBe("970599000000");
	});

	it("locks files for students without the unit", async () => {
		const { files, access } = await run(student);
		expect(files[0].url).toBe(PAID_FILE_URL);
		expect(JSON.stringify(files)).not.toContain(R2_URL);
		expect(access.canOpen).toBe(false);
	});

	it("opens files for owners and admins", async () => {
		const owner = await run({ ...student, unlockedUnitIds: [UNIT] });
		expect(owner.files[0].url).toBe(R2_URL);
		expect(owner.access.canOpen).toBe(true);
		expect(owner.access.ownedUnitIds).toEqual([UNIT]);

		const admin = await run({ ...student, role: "ADMIN" });
		expect(admin.files[0].url).toBe(R2_URL);
	});
});

describe("getResources outside a paid unit", () => {
	it("behaves as before: links for any signed-in student", async () => {
		prisma.folder.findUnique.mockResolvedValue({ price: null });
		const { files, access } = await run(student);
		expect(files[0].url).toBe(R2_URL);
		expect(access.canOpen).toBe(true);
		expect(access.whatsAppNumber).toBeNull();
		expect(prisma.landingPage.findFirst).not.toHaveBeenCalled();
	});
});
