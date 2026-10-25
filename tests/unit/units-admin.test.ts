// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, session } = vi.hoisted(() => ({
	prisma: {
		folder: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
		user: { findUnique: vi.fn(), update: vi.fn() },
	},
	session: { current: null as null | { user: Record<string, unknown> } },
}));

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({
	getServerSession: vi.fn(async () => session.current),
}));
vi.mock("@/libs/revalidate", () => ({ revalidateResourcePages: vi.fn() }));

import { PATCH } from "@/app/api/folder/route";
import { GET as listUnits } from "@/app/api/units/route";
import { PUT as setUnits } from "@/app/api/user/[id]/units/route";

const ROOT = "a".repeat(24);
const UNIT = "b".repeat(24);
const LESSON = "c".repeat(24);
const USER = "e".repeat(24);
const CLASS = "f".repeat(24);

const json = (method: string, body: unknown) =>
	new Request("http://x", {
		method,
		body: JSON.stringify(body),
		headers: { "content-type": "application/json" },
	}) as never;
const asAdmin = () => (session.current = { user: { id: "1", role: "ADMIN" } });
const asStudent = () => (session.current = { user: { id: "2", role: "USER" } });

const folders: Record<string, object> = {
	[ROOT]: { id: ROOT, isRoot: true, parentFolderId: null },
	[UNIT]: { id: UNIT, isRoot: false, parentFolderId: ROOT },
	[LESSON]: { id: LESSON, isRoot: false, parentFolderId: UNIT },
};

beforeEach(() => {
	session.current = null;
	prisma.folder.findUnique.mockImplementation(
		async ({ where }: { where: { id: string } }) => folders[where.id] ?? null
	);
	// Priced folders, then root ids (see listPaidUnits).
	prisma.folder.findMany.mockImplementation(
		async ({ where }: { where: Record<string, unknown> }) =>
			where.isRoot
				? [{ id: ROOT }]
				: [
						{
							id: UNIT,
							name: "الوحدة 1",
							price: 100,
							rank: "a",
							classId: CLASS,
							parentFolderId: ROOT,
							parentClass: { name: "الحادي عشر" },
						},
						{
							id: LESSON,
							name: "درس مسعّر بالغلط",
							price: 50,
							rank: "a",
							classId: CLASS,
							parentFolderId: UNIT,
							parentClass: { name: "الحادي عشر" },
						},
					]
	);
	prisma.folder.update.mockImplementation(async ({ data }) => data);
	prisma.user.findUnique.mockResolvedValue({ id: USER });
	prisma.user.update.mockImplementation(async ({ data }) => data);
});

describe("PATCH /api/folder (unit price)", () => {
	it("is admin-only", async () => {
		expect(
			(await PATCH(json("PATCH", { folderId: UNIT, price: 100 }))).status
		).toBe(401);
		asStudent();
		expect(
			(await PATCH(json("PATCH", { folderId: UNIT, price: 100 }))).status
		).toBe(403);
	});

	it("prices first-level folders only", async () => {
		asAdmin();
		expect(
			(await PATCH(json("PATCH", { folderId: ROOT, price: 100 }))).status
		).toBe(400);
		expect(
			(await PATCH(json("PATCH", { folderId: LESSON, price: 100 }))).status
		).toBe(400);
		const ok = await PATCH(json("PATCH", { folderId: UNIT, price: 100 }));
		expect(ok.status).toBe(200);
		expect(prisma.folder.update).toHaveBeenCalledWith({
			where: { id: UNIT },
			data: { price: 100 },
		});
	});

	it("rejects bad prices and clears with null", async () => {
		asAdmin();
		for (const price of [0, -5, 1.5, "100", 100001]) {
			expect(
				(await PATCH(json("PATCH", { folderId: UNIT, price }))).status
			).toBe(400);
		}
		expect(
			(await PATCH(json("PATCH", { folderId: UNIT, price: null }))).status
		).toBe(200);
		expect(prisma.folder.update).toHaveBeenLastCalledWith({
			where: { id: UNIT },
			data: { price: null },
		});
	});
});

describe("GET /api/units", () => {
	it("lists only priced first-level folders, grouped by class", async () => {
		asAdmin();
		const res = await listUnits();
		expect(await res.json()).toEqual([
			{
				classId: CLASS,
				className: "الحادي عشر",
				units: [{ id: UNIT, name: "الوحدة 1", price: 100 }],
			},
		]);
	});

	it("is admin-only", async () => {
		asStudent();
		expect((await listUnits()).status).toBe(403);
	});
});

describe("PUT /api/user/[id]/units", () => {
	const put = (unitIds: unknown, id = USER) =>
		setUnits(json("PUT", { unitIds }), { params: Promise.resolve({ id }) });

	it("is admin-only", async () => {
		asStudent();
		expect((await put([UNIT])).status).toBe(403);
	});

	it("rejects anything that is not a paid unit", async () => {
		asAdmin();
		expect((await put("x")).status).toBe(400);
		expect((await put([LESSON])).status).toBe(400);
		expect((await put(["zzz"])).status).toBe(400);
		expect((await put([UNIT], "bad")).status).toBe(400);
	});

	it("404 for unknown users", async () => {
		asAdmin();
		prisma.user.findUnique.mockResolvedValueOnce(null);
		expect((await put([UNIT])).status).toBe(404);
	});

	it("replaces the list, deduplicated; [] removes all", async () => {
		asAdmin();
		expect((await put([UNIT, UNIT])).status).toBe(200);
		expect(prisma.user.update).toHaveBeenLastCalledWith(
			expect.objectContaining({
				where: { id: USER },
				data: { unlockedUnitIds: [UNIT] },
			})
		);
		expect((await put([])).status).toBe(200);
		expect(prisma.user.update).toHaveBeenLastCalledWith(
			expect.objectContaining({ data: { unlockedUnitIds: [] } })
		);
	});
});
