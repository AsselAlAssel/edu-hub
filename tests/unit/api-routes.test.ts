// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { prisma, session, r2 } = vi.hoisted(() => {
	const model = () => ({
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		findMany: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		deleteMany: vi.fn(),
	});
	return {
		prisma: {
			class: model(),
			folder: model(),
			file: model(),
			video: model(),
			user: model(),
			landingPage: model(),
			session: model(),
		},
		session: { current: null as null | { user: Record<string, unknown> } },
		r2: { deleteR2Object: vi.fn(), r2KeyFromUrl: vi.fn(() => "obj-key") },
	};
});

vi.mock("@/libs/prismaDb", () => ({ prisma }));
vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({
	getServerSession: vi.fn(async () => session.current),
}));
vi.mock("@/libs/r2", () => r2);
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const ADMIN_ID = "a".repeat(24);
const CLASS_ID = "c".repeat(24);
const FOLDER_ID = "f".repeat(24);
const OTHER_ID = "e".repeat(24);

const asAdmin = () =>
	(session.current = {
		user: { id: ADMIN_ID, role: "ADMIN", email: "admin@x.dev" },
	});
const asUser = () =>
	(session.current = {
		user: { id: "b".repeat(24), role: "USER", email: "u@x.dev" },
	});
const asGuest = () => (session.current = null);

const req = (method: string, body?: unknown) =>
	new Request("http://localhost/api", {
		method,
		headers: { "content-type": "application/json" },
		body: body === undefined ? undefined : JSON.stringify(body),
	}) as never;

beforeEach(() => {
	vi.clearAllMocks();
	asGuest();
});

describe("authorization", () => {
	it.each([
		[
			"folder POST",
			() =>
				import("@/app/api/folder/route").then((m) => m.POST(req("POST", {}))),
		],
		[
			"file DELETE",
			() =>
				import("@/app/api/file/route").then((m) => m.DELETE(req("DELETE", {}))),
		],
		[
			"video PUT",
			() => import("@/app/api/video/route").then((m) => m.PUT(req("PUT", {}))),
		],
		[
			"class POST",
			() =>
				import("@/app/api/class/route").then((m) => m.POST(req("POST", {}))),
		],
		[
			"move POST",
			() => import("@/app/api/move/route").then((m) => m.POST(req("POST", {}))),
		],
		[
			"reorder POST",
			() =>
				import("@/app/api/reorder/route").then((m) => m.POST(req("POST", {}))),
		],
		[
			"landing PUT",
			() =>
				import("@/app/api/landing/route").then((m) => m.PUT(req("PUT", {}))),
		],
		["user GET", () => import("@/app/api/user/route").then((m) => m.GET())],
		[
			"user/get-all GET",
			() => import("@/app/api/user/get-all/route").then((m) => m.GET()),
		],
	])(
		"%s rejects guests with 401 and non-admins with 403",
		async (_name, call) => {
			expect((await call()).status).toBe(401);
			asUser();
			expect((await call()).status).toBe(403);
			expect(prisma.folder.create).not.toHaveBeenCalled();
			expect(prisma.user.findMany).not.toHaveBeenCalled();
		}
	);

	it("never returns password hashes from the user list", async () => {
		asAdmin();
		prisma.user.findMany.mockResolvedValue([]);
		const { GET } = await import("@/app/api/user/route");
		await GET();
		const { select } = prisma.user.findMany.mock.calls[0][0];
		expect(select).toBeDefined();
		expect(select.password).toBeUndefined();
		expect(select.passwordResetToken).toBeUndefined();
	});

	it("user/delete: a regular user cannot delete someone else (legacy hole)", async () => {
		asUser();
		prisma.user.findUnique.mockResolvedValue({
			email: "admin@x.dev",
			role: "ADMIN",
		});
		const { DELETE } = await import("@/app/api/user/delete/route");
		const res = await DELETE(req("DELETE", { email: "admin@x.dev" }));
		expect(res.status).toBe(403);
		expect(prisma.user.delete).not.toHaveBeenCalled();
	});

	it("admins cannot delete or demote themselves", async () => {
		asAdmin();
		const users = await import("@/app/api/user/route");
		expect((await users.DELETE(req("DELETE", { id: ADMIN_ID }))).status).toBe(
			400
		);
		expect(
			(await users.PATCH(req("PATCH", { id: ADMIN_ID, role: "USER" }))).status
		).toBe(400);
		expect(prisma.user.delete).not.toHaveBeenCalled();
	});
});

describe("validation", () => {
	beforeEach(() => asAdmin());

	it("rejects invalid ObjectIds with 400 before touching the database", async () => {
		const folder = await import("@/app/api/folder/route");
		const res = await folder.POST(
			req("POST", { name: "x", classId: "123", parentFolderId: FOLDER_ID })
		);
		expect(res.status).toBe(400);
		expect(prisma.folder.findUnique).not.toHaveBeenCalled();

		const resources = await import("@/app/api/resources/[folderId]/route");
		expect(
			(
				await resources.GET(req("GET"), {
					params: Promise.resolve({ folderId: "not-an-id" }),
				})
			).status
		).toBe(400);
	});

	it("rejects missing / blank fields", async () => {
		const file = await import("@/app/api/file/route");
		expect(
			(await file.PUT(req("PUT", { fileId: FOLDER_ID, name: "   " }))).status
		).toBe(400);
		const cls = await import("@/app/api/class/route");
		expect((await cls.POST(req("POST", { name: "" }))).status).toBe(400);
		expect((await cls.POST(req("POST", "not json"))).status).toBe(400);
	});

	it("returns accurate 404 labels", async () => {
		prisma.file.findUnique.mockResolvedValue(null);
		prisma.video.findUnique.mockResolvedValue(null);
		const file = await import("@/app/api/file/route");
		const video = await import("@/app/api/video/route");
		const fileRes = await file.DELETE(req("DELETE", { fileId: FOLDER_ID }));
		const videoRes = await video.DELETE(req("DELETE", { videoId: FOLDER_ID }));
		expect(fileRes.status).toBe(404);
		expect(await fileRes.json()).toEqual({ message: "File not found" });
		expect(await videoRes.json()).toEqual({ message: "Video not found" });
	});

	it("video POST derives the YouTube id server-side and rejects non-YouTube URLs", async () => {
		const video = await import("@/app/api/video/route");
		const bad = await video.POST(
			req("POST", {
				name: "v",
				url: "https://vimeo.com/1",
				folderId: FOLDER_ID,
				classId: CLASS_ID,
			})
		);
		expect(bad.status).toBe(400);

		prisma.folder.findUnique.mockResolvedValue({
			id: FOLDER_ID,
			classId: CLASS_ID,
		});
		prisma.video.findFirst.mockResolvedValue(null);
		prisma.video.create.mockResolvedValue({ id: OTHER_ID });
		const ok = await video.POST(
			req("POST", {
				name: "v",
				url: "https://youtu.be/dQw4w9WgXcQ",
				videoId: "spoofed-id!",
				folderId: FOLDER_ID,
				classId: CLASS_ID,
			})
		);
		expect(ok.status).toBe(201);
		expect(prisma.video.create.mock.calls[0][0].data.videoId).toBe(
			"dQw4w9WgXcQ"
		);
	});

	it("folder PUT renames by folderId and still accepts the legacy parentFolderId", async () => {
		prisma.folder.findUnique.mockResolvedValue({
			id: FOLDER_ID,
			isRoot: false,
		});
		prisma.folder.update.mockResolvedValue({ id: FOLDER_ID, name: "new" });
		const folder = await import("@/app/api/folder/route");
		expect(
			(await folder.PUT(req("PUT", { folderId: FOLDER_ID, name: "new" })))
				.status
		).toBe(200);
		expect(
			(await folder.PUT(req("PUT", { parentFolderId: FOLDER_ID, name: "new" })))
				.status
		).toBe(200);
		expect(prisma.folder.update).toHaveBeenCalledWith({
			where: { id: FOLDER_ID },
			data: { name: "new" },
		});
	});

	it("refuses to rename or delete a class root folder", async () => {
		prisma.folder.findUnique.mockResolvedValue({ id: FOLDER_ID, isRoot: true });
		const folder = await import("@/app/api/folder/route");
		expect(
			(await folder.PUT(req("PUT", { folderId: FOLDER_ID, name: "x" }))).status
		).toBe(400);
		expect(
			(await folder.DELETE(req("DELETE", { folderId: FOLDER_ID }))).status
		).toBe(400);
	});

	it("move rejects moving a file into another class", async () => {
		prisma.folder.findUnique.mockResolvedValue({
			id: FOLDER_ID,
			classId: CLASS_ID,
		});
		prisma.file.findUnique.mockResolvedValue({
			id: OTHER_ID,
			classId: "d".repeat(24),
		});
		const move = await import("@/app/api/move/route");
		const res = await move.POST(
			req("POST", { type: "file", id: OTHER_ID, targetFolderId: FOLDER_ID })
		);
		expect(res.status).toBe(400);
		expect(prisma.file.update).not.toHaveBeenCalled();
	});

	it("reorder rejects unknown resource types", async () => {
		const reorder = await import("@/app/api/reorder/route");
		expect(
			(await reorder.POST(req("POST", { type: "class", id: FOLDER_ID }))).status
		).toBe(400);
	});

	it("file DELETE also removes the stored R2 object", async () => {
		prisma.file.findUnique.mockResolvedValue({
			id: OTHER_ID,
			url: "https://files.test/obj-key",
		});
		const file = await import("@/app/api/file/route");
		expect(
			(await file.DELETE(req("DELETE", { fileId: OTHER_ID }))).status
		).toBe(204);
		expect(r2.deleteR2Object).toHaveBeenCalledWith("obj-key");
	});
});
