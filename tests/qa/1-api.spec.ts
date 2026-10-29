import { expect, test, type APIRequestContext } from "@playwright/test";
import { ADMIN, client, FREE, PAID, readSeed, type Seed } from "./helpers";

/**
 * Paid units and exams through the API, for every kind of viewer:
 * guest, free (owns nothing), paid (owns the second unit) and admin.
 */
test.describe.configure({ mode: "serial" });

let seed: Seed;
let guest: APIRequestContext;
let free: APIRequestContext;
let paid: APIRequestContext;
let admin: APIRequestContext;

test.beforeAll(async ({ baseURL }) => {
	[guest, free, paid, admin] = await Promise.all([
		client(baseURL!),
		client(baseURL!, FREE),
		client(baseURL!, PAID),
		client(baseURL!, ADMIN),
	]);
	seed = await readSeed(admin);
});

test.afterAll(async () => {
	await Promise.all([guest, free, paid, admin].map((c) => c.dispose()));
});

const resources = async (who: APIRequestContext, folderId: string) => {
	const res = await who.get(`/api/resources/${folderId}`);
	expect(res.status()).toBe(200);
	expect(res.headers()["cache-control"]).toContain("no-store");
	return res.json();
};
const playback = (who: APIRequestContext, name: string) =>
	who.get(`/api/video/${seed.videos[name].id}/playback`);
const folderExams = async (who: APIRequestContext, folderId: string) => {
	const res = await who.get(`/api/folder/${folderId}/exams`);
	expect(res.status()).toBe(200);
	return res.json() as Promise<
		{
			title: string;
			status: { state: string; done?: number; total?: number };
			results: unknown;
		}[]
	>;
};
const examStatus = async (who: APIRequestContext, title: string) => {
	const exam = seed.exams[title];
	const list = await folderExams(who, exam.folderId);
	return list.find((e) => e.title === title)!.status;
};

test.describe("resources: what each viewer gets", () => {
	test("free unit: YouTube open to all, Bunny stripped but unlocked", async () => {
		for (const who of [guest, free, paid, admin]) {
			const r = await resources(who, seed.free.lessonId);
			const yt = r.videos.find((v: { name: string }) => v.name === "مقدمة");
			expect(yt.url).toContain("youtube.com");
			const bunny = r.videos.find(
				(v: { name: string }) => v.name === "فيديو Bunny مجاني"
			);
			// The Bunny link and id never reach the browser, even for admins.
			expect(bunny).toMatchObject({
				url: "",
				videoId: "",
				isBunny: true,
				locked: false,
			});
			expect(r.access.canOpen).toBe(true);
			expect(r.access.unit.price).toBeNull();
			expect(r.access.whatsAppNumber).toBeNull();
		}
	});

	test("files: guests get no name or link; signed-in users get them in free units", async () => {
		const g = await resources(guest, seed.free.id);
		expect(g.files[0]).toMatchObject({ name: "", url: "signin" });
		for (const who of [free, paid, admin]) {
			const r = await resources(who, seed.free.id);
			expect(r.files[0].url).toMatch(/^https:\/\//);
			expect(r.files[0].name).toContain("ملخص");
		}
	});

	test("owned paid unit: open for paid + admin, locked for free, sign-in for guest", async () => {
		const g = await resources(guest, seed.owned.id);
		expect(g.access.canOpen).toBe(false);
		expect(g.files[0]).toMatchObject({ name: "", url: "signin" });
		expect(g.videos[0]).toMatchObject({ isBunny: true, locked: true, url: "" });
		expect(g.access.whatsAppNumber).toBe("970599000000");
		expect(g.access.unit.price).toBe(50);

		const f = await resources(free, seed.owned.id);
		expect(f.access.canOpen).toBe(false);
		expect(f.files[0]).toMatchObject({ name: "", url: "paid" });
		expect(f.videos[0]).toMatchObject({ locked: true, url: "" });

		for (const who of [paid, admin]) {
			const r = await resources(who, seed.owned.id);
			expect(r.access.canOpen).toBe(true);
			expect(r.files[0].url).toMatch(/^https:\/\//);
			expect(r.videos[0]).toMatchObject({ locked: false, url: "" });
		}
	});

	test("a lesson inside a paid unit inherits the unit's lock", async () => {
		const f = await resources(free, seed.owned.lessonId);
		expect(f.access.unit.id).toBe(seed.owned.id);
		expect(f.access.canOpen).toBe(false);
		expect(f.videos[0].locked).toBe(true);
		const p = await resources(paid, seed.owned.lessonId);
		expect(p.access.canOpen).toBe(true);
	});

	test("locked unit: only the admin can open it", async () => {
		for (const who of [guest, free, paid])
			expect((await resources(who, seed.locked.id)).access.canOpen).toBe(false);
		expect((await resources(admin, seed.locked.id)).access.canOpen).toBe(true);
	});

	test("owned unit ids are reported per viewer (for the badges)", async () => {
		expect((await resources(paid, seed.rootId)).access.ownedUnitIds).toEqual([
			seed.owned.id,
		]);
		expect((await resources(free, seed.rootId)).access.ownedUnitIds).toEqual(
			[]
		);
		expect((await resources(guest, seed.rootId)).access.ownedUnitIds).toEqual(
			[]
		);
	});

	test("bad folder id is a 400", async () => {
		expect((await guest.get("/api/resources/nope")).status()).toBe(400);
	});
});

test.describe("Bunny playback", () => {
	test("guest: 401 everywhere", async () => {
		for (const name of [
			"فيديو Bunny مجاني",
			"فيديو الوحدة المدفوعة",
			"فيديو مقفل",
		])
			expect((await playback(guest, name)).status()).toBe(401);
	});

	test("free: plays free-unit Bunny, 403 on paid units", async () => {
		expect((await playback(free, "فيديو Bunny مجاني")).status()).toBe(200);
		expect((await playback(free, "فيديو الوحدة المدفوعة")).status()).toBe(403);
		expect((await playback(free, "درس مدفوع")).status()).toBe(403);
		expect((await playback(free, "فيديو مقفل")).status()).toBe(403);
	});

	test("paid: plays the owned unit (and its lessons), 403 on the locked one", async () => {
		for (const name of [
			"فيديو الوحدة المدفوعة",
			"درس مدفوع",
			"فيديو Bunny مجاني",
		])
			expect((await playback(paid, name)).status()).toBe(200);
		expect((await playback(paid, "فيديو مقفل")).status()).toBe(403);
	});

	test("admin plays everything", async () => {
		for (const name of [
			"فيديو Bunny مجاني",
			"فيديو الوحدة المدفوعة",
			"درس مدفوع",
			"فيديو مقفل",
		])
			expect((await playback(admin, name)).status()).toBe(200);
	});

	test("signed URL, short expiry, no caching, viewer's email as watermark", async () => {
		const res = await playback(paid, "فيديو الوحدة المدفوعة");
		expect(res.headers()["cache-control"]).toContain("no-store");
		const body = await res.json();
		expect(body.watermark).toBe(PAID);
		const url = new URL(body.url);
		expect(url.hostname).toBe("player.mediadelivery.net");
		expect(url.searchParams.get("token")).toMatch(/^[0-9a-f]{64}$/);
		const ttl = Number(url.searchParams.get("expires")) - Date.now() / 1000;
		expect(ttl).toBeGreaterThan(60);
		expect(ttl).toBeLessThanOrEqual(121);
		expect(url.pathname).toMatch(
			/^\/embed\/\d+\/00000000-0000-4000-8000-\d{12}$/
		);
	});

	test("bad ids and YouTube videos", async () => {
		expect((await paid.get("/api/video/nope/playback")).status()).toBe(400);
		expect(
			(await paid.get("/api/video/0123456789abcdef01234567/playback")).status()
		).toBe(404);
		// A YouTube video has no Bunny playback.
		expect((await playback(paid, "مقدمة")).status()).toBe(404);
	});

	test("thumbnail route never fails (dummy video → placeholder)", async () => {
		const res = await guest.get(
			`/api/video/${seed.videos["فيديو مقفل"].id}/thumbnail`,
			{ maxRedirects: 0 }
		);
		expect([200, 307, 308]).toContain(res.status());
		const bad = await guest.get("/api/video/nope/thumbnail", {
			maxRedirects: 0,
		});
		expect(bad.headers()["location"]).toContain("video-placeholder.svg");
	});
});

test.describe("exam access (status per viewer)", () => {
	const ALWAYS = "اختبار مفتوح (ALWAYS)";
	const FOLDER = "اختبار بعد فيديوهات الدرس (FOLDER)";
	const TREE = "اختبار بعد كل الوحدة (TREE)";
	const LOCKED = "اختبار الوحدة المقفلة";

	test("guest must sign in for every exam", async () => {
		for (const t of [ALWAYS, FOLDER, TREE, LOCKED])
			expect((await examStatus(guest, t)).state).toBe("signin");
	});

	test("free: ALWAYS open, FOLDER needs videos, paid units → paid", async () => {
		expect((await examStatus(free, ALWAYS)).state).toBe("open");
		expect(await examStatus(free, FOLDER)).toEqual({
			state: "progress",
			done: 0,
			total: 3,
		});
		expect((await examStatus(free, TREE)).state).toBe("paid");
		expect((await examStatus(free, LOCKED)).state).toBe("paid");
	});

	test("paid: FOLDER counts their watched video; TREE waits for the unit", async () => {
		expect(await examStatus(paid, FOLDER)).toEqual({
			state: "progress",
			done: 1,
			total: 3,
		});
		expect(await examStatus(paid, TREE)).toEqual({
			state: "progress",
			done: 0,
			total: 2,
		});
		expect((await examStatus(paid, LOCKED)).state).toBe("paid");
	});

	test("admin: everything open", async () => {
		for (const t of [ALWAYS, FOLDER, TREE, LOCKED])
			expect((await examStatus(admin, t)).state).toBe("open");
	});

	test("questions: only when open, never with the answer key", async () => {
		const id = seed.exams[ALWAYS].id;
		const res = await free.get(`/api/exams/${id}/questions?offset=0&limit=10`);
		expect(res.status()).toBe(200);
		const qs = await res.json();
		expect(qs).toHaveLength(3);
		for (const q of qs) expect(q).not.toHaveProperty("correctIndex");
		expect(qs[0].text).toBe("مشتقة x² هي؟");

		expect((await guest.get(`/api/exams/${id}/questions`)).status()).toBe(403);
		expect(
			(await free.get(`/api/exams/${seed.exams[TREE].id}/questions`)).status()
		).toBe(403);
		expect(
			(await paid.get(`/api/exams/${seed.exams[LOCKED].id}/questions`)).status()
		).toBe(403);
		for (const q of ["offset=-1", "limit=0", "limit=1000", "offset=1.5"])
			expect((await free.get(`/api/exams/${id}/questions?${q}`)).status()).toBe(
				400
			);
		expect((await free.get("/api/exams/nope/questions")).status()).toBe(404);
	});

	test("questions page through in the admin's order", async () => {
		const id = seed.exams[ALWAYS].id;
		const page2 = await (
			await free.get(`/api/exams/${id}/questions?offset=1&limit=1`)
		).json();
		expect(page2.map((q: { text: string }) => q.text)).toEqual([
			"مشتقة الثابت هي؟",
		]);
	});

	test("submit grades, saves the attempt and returns the key", async () => {
		const id = seed.exams[ALWAYS].id;
		const qs = await (await free.get(`/api/exams/${id}/questions`)).json();
		// Right, wrong, unanswered.
		const res = await free.post(`/api/exams/${id}/submit`, {
			data: { answers: { [qs[0].id]: 1, [qs[1].id]: 3 } },
		});
		expect(res.status()).toBe(200);
		const result = await res.json();
		expect(result).toMatchObject({ correct: 1, total: 3 });
		expect(Object.keys(result.key)).toHaveLength(3);

		const mine = (await folderExams(free, seed.free.id)).find(
			(e) => e.title === ALWAYS
		)!;
		expect(mine.results).toMatchObject({ count: 1 });
	});

	test("submit is refused when locked, for guests and for junk", async () => {
		const id = seed.exams[ALWAYS].id;
		expect(
			(
				await guest.post(`/api/exams/${id}/submit`, { data: { answers: {} } })
			).status()
		).toBe(403);
		expect(
			(
				await free.post(`/api/exams/${seed.exams[TREE].id}/submit`, {
					data: { answers: {} },
				})
			).status()
		).toBe(403);
		expect(
			(await free.post(`/api/exams/${id}/submit`, { data: {} })).status()
		).toBe(400);
		expect(
			(
				await free.post(`/api/exams/${id}/submit`, { data: { answers: "x" } })
			).status()
		).toBe(400);
	});

	test("marking Bunny videos done by hand unlocks a TREE exam", async () => {
		const ids = ["فيديو الوحدة المدفوعة", "درس مدفوع"].map(
			(n) => seed.videos[n].id
		);
		await paid.post("/api/progress", {
			data: { videoId: ids[0], completed: true },
		});
		expect(await examStatus(paid, TREE)).toEqual({
			state: "progress",
			done: 1,
			total: 2,
		});
		await paid.post("/api/progress", {
			data: { videoId: ids[1], completed: true },
		});
		expect((await examStatus(paid, TREE)).state).toBe("open");
		// Un-marking locks it again.
		await paid.post("/api/progress", {
			data: { videoId: ids[1], completed: false },
		});
		expect((await examStatus(paid, TREE)).state).toBe("progress");
		await paid.post("/api/progress", {
			data: { videoId: ids[1], completed: true },
		});
	});

	test("progress API rejects guests and junk", async () => {
		const v = seed.videos["مقدمة"].id;
		expect(
			(
				await guest.post("/api/progress", {
					data: { videoId: v, completed: true },
				})
			).status()
		).toBe(401);
		expect(
			(await free.post("/api/progress", { data: { videoId: "x" } })).status()
		).toBe(400);
		expect(
			(await free.post("/api/progress", { data: { videoId: v } })).status()
		).toBe(400);
		expect(
			(
				await free.post("/api/progress", {
					data: { videoId: "0123456789abcdef01234567", completed: true },
				})
			).status()
		).toBe(404);
	});
});

test.describe("admin-only endpoints refuse everyone else", () => {
	const calls: [string, string, unknown?][] = [
		["get", "/api/units"],
		["get", "/api/exams"],
		["post", "/api/exams", {}],
		["get", "/api/exams/questions?lesson=x"],
		["post", "/api/exams/questions", {}],
		["get", "/api/exams/lessons"],
		["patch", "/api/folder", {}],
		["post", "/api/folder", {}],
		["get", "/api/user"],
	];
	for (const [method, path, data] of calls)
		test(`${method.toUpperCase()} ${path}`, async () => {
			const call = (who: APIRequestContext) =>
				(
					who as unknown as Record<
						string,
						(p: string, o?: object) => Promise<{ status(): number }>
					>
				)[method](path, data === undefined ? undefined : { data });
			expect((await call(guest)).status()).toBe(401);
			expect((await call(free)).status()).toBe(403);
			expect((await call(paid)).status()).toBe(403);
		});

	test("PUT /api/user/[id]/units", async () => {
		const id = seed.users[FREE].id;
		const data = { unitIds: [seed.locked.id] };
		expect((await guest.put(`/api/user/${id}/units`, { data })).status()).toBe(
			401
		);
		expect((await free.put(`/api/user/${id}/units`, { data })).status()).toBe(
			403
		);
		expect((await paid.put(`/api/user/${id}/units`, { data })).status()).toBe(
			403
		);
	});

	test("PATCH/DELETE on exams and questions", async () => {
		const exam = seed.exams["اختبار مفتوح (ALWAYS)"].id;
		for (const who of [free, paid]) {
			expect(
				(await who.patch(`/api/exams/${exam}`, { data: {} })).status()
			).toBe(403);
			expect((await who.delete(`/api/exams/${exam}`)).status()).toBe(403);
		}
	});
});

test.describe("admin: units", () => {
	test("lists every paid unit grouped by class", async () => {
		const groups = await (await admin.get("/api/units")).json();
		const qa = groups.find(
			(g: { className: string }) => g.className === "رياضيات - QA"
		);
		expect(
			qa.units.map((u: { id: string; price: number }) => [u.id, u.price])
		).toEqual([
			[seed.owned.id, 50],
			[seed.locked.id, 30],
		]);
	});

	test("unlocking a unit for a student takes effect at once, and back", async () => {
		const id = seed.users[FREE].id;
		const put = (unitIds: string[]) =>
			admin.put(`/api/user/${id}/units`, { data: { unitIds } });

		const res = await put([seed.locked.id, seed.locked.id]);
		expect(res.status()).toBe(200);
		expect((await res.json()).unlockedUnitIds).toEqual([seed.locked.id]);
		expect((await playback(free, "فيديو مقفل")).status()).toBe(200);
		expect((await resources(free, seed.locked.id)).files[0].url).toMatch(
			/^https/
		);

		expect((await put([])).status()).toBe(200);
		expect((await playback(free, "فيديو مقفل")).status()).toBe(403);
	});

	test("rejects free folders, junk and unknown users", async () => {
		const id = seed.users[FREE].id;
		const put = (data: unknown, user = id) =>
			admin.put(`/api/user/${user}/units`, { data });
		expect((await put({ unitIds: [seed.free.id] })).status()).toBe(400);
		expect((await put({ unitIds: [seed.owned.lessonId] })).status()).toBe(400);
		expect((await put({ unitIds: "x" })).status()).toBe(400);
		expect((await put({ unitIds: ["nope"] })).status()).toBe(400);
		expect(
			(await put({ unitIds: [] }, "0123456789abcdef01234567")).status()
		).toBe(404);
	});

	test("price: set, change, clear, and validation", async () => {
		const patch = (price: unknown, folderId = seed.free.id) =>
			admin.patch("/api/folder", { data: { folderId, price } });
		for (const bad of [0, -5, 1.5, "10", 100_001])
			expect((await patch(bad)).status(), `price ${bad}`).toBe(400);
		expect((await patch(10, seed.free.lessonId)).status()).toBe(400);
		expect((await patch(10, seed.rootId)).status()).toBe(400);

		expect((await patch(20)).status()).toBe(200);
		expect((await resources(free, seed.free.id)).access.canOpen).toBe(false);
		expect((await playback(free, "فيديو Bunny مجاني")).status()).toBe(403);
		// YouTube stays public even inside a paid unit.
		expect((await resources(free, seed.free.lessonId)).videos[0].url).toContain(
			"youtube"
		);

		expect((await patch(null)).status()).toBe(200);
		expect((await resources(free, seed.free.id)).access.canOpen).toBe(true);
	});

	test("create a folder with a price: only directly under the class root", async () => {
		const post = (parentFolderId: string, price?: unknown) =>
			admin.post("/api/folder", {
				data: {
					name: "وحدة اختبار",
					parentFolderId,
					classId: seed.classId,
					price,
				},
			});
		expect((await post(seed.free.id, 15)).status()).toBe(400);
		expect((await post(seed.rootId, 0)).status()).toBe(400);
		const res = await post(seed.rootId, 15);
		expect(res.status()).toBe(201);
		const folder = await res.json();
		expect(folder.price).toBe(15);
		expect(
			(
				await admin.delete("/api/folder", { data: { folderId: folder.id } })
			).status()
		).toBe(204);
	});
});

test.describe("admin: question bank and exams", () => {
	let questionId: string;
	let examId: string;

	test("lessons and questions by lesson", async () => {
		const lessons = await (await admin.get("/api/exams/lessons")).json();
		expect(JSON.stringify(lessons)).toContain("التفاضل");
		const res = await admin.get(
			`/api/exams/questions?lesson=${encodeURIComponent("التكامل")}`
		);
		expect(res.status()).toBe(200);
		expect(JSON.stringify(await res.json())).toContain("تكامل 2x dx");
		expect((await admin.get("/api/exams/questions")).status()).toBe(400);
	});

	test("create, validate, edit a question", async () => {
		const base = {
			lesson: "درس QA",
			text: "سؤال QA؟",
			options: ["أ", "ب"],
			correctIndex: 1,
		};
		for (const bad of [
			{ ...base, text: "" },
			{ ...base, options: ["وحيد"] },
			{ ...base, correctIndex: 2 },
			{ ...base, correctIndex: -1 },
			{ ...base, lesson: "" },
		])
			expect(
				(await admin.post("/api/exams/questions", { data: bad })).status(),
				JSON.stringify(bad)
			).toBe(400);

		const res = await admin.post("/api/exams/questions", { data: base });
		expect(res.status()).toBe(200);
		questionId = (await res.json()).id;
		const edit = await admin.patch(`/api/exams/questions/${questionId}`, {
			data: { ...base, text: "سؤال QA معدّل؟" },
		});
		expect(edit.status()).toBe(200);
		expect((await edit.json()).text).toBe("سؤال QA معدّل؟");
	});

	test("create, validate, edit an exam", async () => {
		const base = {
			title: "امتحان QA",
			folderId: seed.free.id,
			questionIds: [questionId],
			unlockRule: "ALWAYS",
		};
		for (const bad of [
			{ ...base, title: "" },
			{ ...base, folderId: "0123456789abcdef01234567" },
			{ ...base, questionIds: [] },
			{ ...base, unlockRule: "NEVER" },
		])
			expect(
				(await admin.post("/api/exams", { data: bad })).status(),
				JSON.stringify(bad)
			).toBe(400);

		const res = await admin.post("/api/exams", { data: base });
		expect(res.status()).toBe(200);
		examId = (await res.json()).id;

		const edit = await admin.patch(`/api/exams/${examId}`, {
			data: { ...base, unlockRule: "FOLDER" },
		});
		expect(edit.status()).toBe(200);
		// The free unit itself has no videos: FOLDER is open at once.
		const list = await folderExams(free, seed.free.id);
		expect(list.find((e) => e.title === "امتحان QA")!.status.state).toBe(
			"open"
		);
	});

	test("deleting a question removes it from exams; deleting an exam", async () => {
		expect(
			(await admin.delete(`/api/exams/questions/${questionId}`)).status()
		).toBe(200);
		const qs = await (await free.get(`/api/exams/${examId}/questions`)).json();
		expect(qs).toEqual([]);
		expect((await admin.delete(`/api/exams/${examId}`)).status()).toBe(200);
		expect((await free.get(`/api/folder/${seed.free.id}/exams`)).status()).toBe(
			200
		);
		expect((await free.get(`/api/exams/${examId}/questions`)).status()).toBe(
			404
		);
	});
});

test.describe("hidden class", () => {
	test("its content API is 404 for everyone but the admin", async () => {
		for (const id of [seed.hidden.rootId, seed.hidden.unitId]) {
			for (const who of [guest, free, paid])
				expect((await who.get(`/api/resources/${id}`)).status()).toBe(404);
			const r = await admin.get(`/api/resources/${id}`);
			expect(r.status()).toBe(200);
		}
		const unit = await (
			await admin.get(`/api/resources/${seed.hidden.unitId}`)
		).json();
		expect(unit.videos[0].name).toBe("فيديو مخفي");
	});

	test("missing from the public class list, listed for the admin", async () => {
		const names = async (who: APIRequestContext) =>
			(await (await who.get("/api/class")).json()).map(
				(c: { name: string }) => c.name
			);
		for (const who of [guest, free, paid])
			expect(await names(who)).not.toContain("صف مخفي - QA");
		expect(await names(admin)).toContain("صف مخفي - QA");
	});

	test("the cached page HTML carries none of its content", async () => {
		const html = await (
			await guest.get(
				`/class/${seed.hidden.classId}/folder/${seed.hidden.rootId}`
			)
		).text();
		expect(html).not.toContain("وحدة الصف المخفي");
		expect(html).toContain("noindex");
	});
});
