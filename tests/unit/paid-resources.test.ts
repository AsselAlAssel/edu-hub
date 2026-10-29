// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, crumbs } = vi.hoisted(() => ({
	prisma: {
		folder: { findMany: vi.fn(), findUnique: vi.fn() },
		video: { findMany: vi.fn() },
		file: { findMany: vi.fn() },
		landingPage: { findFirst: vi.fn() },
	},
	crumbs: { current: [] as { id: string; name: string; price?: number }[] },
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
const student = {
	id: "u",
	email: null,
	role: "USER",
	unlockedUnitIds: [] as string[],
};

const run = (viewer?: Parameters<typeof getResources>[1]) =>
	getResources(UNIT, viewer);

beforeEach(() => {
	crumbs.current = [
		{ id: ROOT, name: "root" },
		{ id: UNIT, name: "الوحدة 1", price: 100 },
	];
	prisma.folder.findMany.mockResolvedValue([]);
	prisma.video.findMany.mockResolvedValue([]);
	prisma.file.findMany.mockResolvedValue([file]);
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

	it("locks files for students without the unit: no link, no name", async () => {
		const { files, access } = await run(student);
		expect(files[0].url).toBe(PAID_FILE_URL);
		expect(files[0].name).toBe("");
		expect(JSON.stringify(files)).not.toContain(R2_URL);
		expect(access.canOpen).toBe(false);
	});

	it("never sends a Bunny video's link or id; flags it instead", async () => {
		const GUID = "594324c9-0b1e-48cc-945a-f1bd20716fc0";
		prisma.video.findMany.mockResolvedValue([
			{
				id: "v1",
				name: "شرح",
				url: `https://iframe.mediadelivery.net/embed/789604/${GUID}`,
				videoId: GUID,
			},
			{
				id: "v2",
				name: "مقدمة",
				url: "https://youtu.be/dQw4w9WgXcQ",
				videoId: "dQw4w9WgXcQ",
			},
		]);
		const stranger = await run(student);
		expect(JSON.stringify(stranger.videos)).not.toContain(GUID);
		expect(stranger.videos[0]).toMatchObject({ isBunny: true, locked: true });
		expect(stranger.videos[1].url).toBe("https://youtu.be/dQw4w9WgXcQ");

		const owner = await run({ ...student, unlockedUnitIds: [UNIT] });
		expect(owner.videos[0]).toMatchObject({ isBunny: true, locked: false });
		expect(JSON.stringify(owner.videos)).not.toContain(GUID);
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
		crumbs.current[1].price = undefined;
		const { files, access } = await run(student);
		expect(files[0].url).toBe(R2_URL);
		expect(access.canOpen).toBe(true);
		expect(access.whatsAppNumber).toBeNull();
	});
});
