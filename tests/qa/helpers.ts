import { request, type APIRequestContext, type Page } from "@playwright/test";

export const PASSWORD = "Test1234!";
export const ADMIN = "admin@qa.test";
export const PAID = "paid@qa.test";
export const FREE = "free@qa.test";

/**
 * Signs in through the credentials provider (there is no password form in
 * the UI any more). `target` is a page's request context or a standalone one;
 * a page's shares its cookies with the browser.
 */
export async function signIn(target: APIRequestContext, email: string) {
	const { csrfToken } = await (await target.get("/api/auth/csrf")).json();
	const res = await target.post("/api/auth/callback/credentials", {
		form: { csrfToken, email, password: PASSWORD, json: "true" },
		maxRedirects: 0,
	});
	if (res.status() >= 400) throw new Error(`sign-in ${email}: ${res.status()}`);
	const session = await (await target.get("/api/auth/session")).json();
	if (session?.user?.email !== email)
		throw new Error(`no session for ${email}`);
}

export const loginPage = (page: Page, email: string) =>
	signIn(page.request, email);

/** A standalone API client, signed in as `email` (or a guest). */
export async function client(baseURL: string, email?: string) {
	const ctx = await request.newContext({ baseURL });
	if (email) await signIn(ctx, email);
	return ctx;
}

export type Video = {
	id: string;
	name: string;
	url: string;
	isBunny?: boolean;
	locked?: boolean;
};
export type Seed = {
	classId: string;
	rootId: string;
	free: { id: string; lessonId: string };
	owned: { id: string; lessonId: string };
	locked: { id: string };
	/** The hidden class (admins only). */
	hidden: { classId: string; rootId: string; unitId: string };
	videos: Record<string, Video>;
	files: Record<string, { id: string; name: string; url: string }>;
	exams: Record<string, { id: string; title: string; folderId: string }>;
	users: Record<string, { id: string; email: string }>;
};

/** Ids of the seeded data, read through the admin APIs. */
export async function readSeed(admin: APIRequestContext): Promise<Seed> {
	const classes = await (await admin.get("/api/class")).json();
	const cls = classes.find((c: { name: string }) => c.name === "رياضيات - QA");
	const rootId = cls.folders[0].id;
	const hiddenCls = classes.find(
		(c: { name: string }) => c.name === "صف مخفي - QA"
	);
	const res = async (id: string) =>
		(await admin.get(`/api/resources/${id}`)).json();
	const root = await res(rootId);
	const byName = (list: { name: string; id: string }[], part: string) =>
		list.find((f) => f.name.includes(part))!;
	const free = byName(root.folders, "الأولى");
	const owned = byName(root.folders, "الثانية");
	const locked = byName(root.folders, "الثالثة");
	const freeRes = await res(free.id);
	const ownedRes = await res(owned.id);
	const freeLesson = await res(freeRes.folders[0].id);
	const ownedLesson = await res(ownedRes.folders[0].id);
	const lockedRes = await res(locked.id);

	const videos: Record<string, Video> = {};
	const files: Seed["files"] = {};
	for (const r of [freeRes, ownedRes, freeLesson, ownedLesson, lockedRes]) {
		for (const v of r.videos) videos[v.name] = v;
		for (const f of r.files) files[f.name] = f;
	}
	const exams: Seed["exams"] = {};
	for (const e of (await (await admin.get("/api/exams")).json()).exams)
		exams[e.title] = e;
	const users: Seed["users"] = {};
	for (const u of await (await admin.get("/api/user")).json())
		users[u.email] = u;

	return {
		classId: cls.id,
		rootId,
		free: { id: free.id, lessonId: freeRes.folders[0].id },
		owned: { id: owned.id, lessonId: ownedRes.folders[0].id },
		locked: { id: locked.id },
		hidden: {
			classId: hiddenCls.id,
			rootId: hiddenCls.folders[0].id,
			unitId: (await res(hiddenCls.folders[0].id)).folders[0].id,
		},
		videos,
		files,
		exams,
		users,
	};
}

export const folderUrl = (seed: Seed, folderId: string) =>
	`/class/${seed.classId}/folder/${folderId}`;
