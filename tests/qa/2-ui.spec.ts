import { expect, test, type Page } from "@playwright/test";
import {
	ADMIN,
	client,
	folderUrl,
	FREE,
	loginPage,
	PAID,
	readSeed,
	type Seed,
} from "./helpers";

/** Every button on the paid-unit and exam screens, clicked as each viewer. */
test.describe.configure({ mode: "default" });

let seed: Seed;
test.beforeAll(async ({ baseURL }) => {
	const admin = await client(baseURL!, ADMIN);
	seed = await readSeed(admin);
	await admin.dispose();
});

const openFolder = async (page: Page, folderId: string) => {
	await page.goto(folderUrl(seed, folderId));
	await expect(page.locator("main#main-content")).toBeVisible();
};
const card = (page: Page, name: string) =>
	page.getByRole("button", {
		name: new RegExp(`(تشغيل الفيديو|فيديو للمشتركين): ${name}`),
	});

/** The folder's exams panel (behind its "الامتحانات" button). */
const openExams = async (page: Page) => {
	await page.getByRole("button", { name: "الامتحانات", exact: true }).click();
	return page.getByRole("dialog", { name: "امتحانات المجلد" });
};

/** The Google sign-in starts (we stop it before it leaves the site). */
const expectGoogleSignIn = async (page: Page, click: () => Promise<void>) => {
	await page.route(/accounts\.google\.com/, (route) => route.abort());
	const started = page.waitForRequest(/\/api\/auth\/signin\/google/);
	await click();
	await started;
};

test.describe("guest", () => {
	test("class page badges the paid units with their price", async ({
		page,
	}) => {
		await openFolder(page, seed.rootId);
		await expect(page.getByText("50 ₪")).toBeVisible();
		await expect(page.getByText("30 ₪")).toBeVisible();
		await expect(page.getByText("مشترك", { exact: true })).toHaveCount(0);
	});

	test("paid unit: locked video opens the paywall with sign-in first", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await card(page, "فيديو الوحدة المدفوعة").click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toContainText("للمشتركين");
		await expect(dialog).toContainText("سجّل دخولك أولاً");
		await expectGoogleSignIn(page, () =>
			dialog.getByRole("button", { name: "تسجيل الدخول" }).click()
		);
	});

	test("files ask to sign in; nothing leaks in the page", async ({ page }) => {
		await openFolder(page, seed.free.id);
		await expect(page.getByText("سجّل الدخول للوصول للملفات")).toBeVisible();
		const html = await page.content();
		expect(html).not.toContain("dummy.pdf");
		expect(html).not.toContain("mediadelivery");
	});

	test("free Bunny video asks to sign in inside the player", async ({
		page,
	}) => {
		await openFolder(page, seed.free.lessonId);
		await card(page, "فيديو Bunny مجاني").click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toContainText("سجّل الدخول لمشاهدة هذا الفيديو");
		await expectGoogleSignIn(page, () =>
			dialog.getByRole("button", { name: "تسجيل الدخول" }).click()
		);
	});

	test("exam button starts Google sign-in", async ({ page }) => {
		await openFolder(page, seed.free.id);
		const btn = (await openExams(page)).getByRole("button", {
			name: "سجّل الدخول لتقديم الامتحان",
		});
		await expect(btn).toBeVisible();
		await expectGoogleSignIn(page, () => btn.click());
	});

	test("the exam page sends guests back to the folder", async ({ page }) => {
		await page.goto(`/exam/${seed.exams["اختبار مفتوح (ALWAYS)"].id}`);
		await expect(page).toHaveURL(new RegExp(folderUrl(seed, seed.free.id)));
	});

	test("admin pages send guests home; /auth/signin is gone", async ({
		page,
	}) => {
		for (const path of ["/admin/profile", "/admin/exams"]) {
			await page.goto(path);
			await expect(page).toHaveURL(/^[^?]*\/$/);
		}
		const res = await page.goto("/auth/signin");
		expect(res?.status()).toBe(404);
	});
});

test.describe("free student", () => {
	test.beforeEach(async ({ page }) => loginPage(page, FREE));

	test("paid unit: lock badges, paywall with a WhatsApp message", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await expect(page.getByText("للمشتركين").first()).toBeVisible();
		await card(page, "فيديو الوحدة المدفوعة").click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toContainText("«الوحدة الثانية");
		const wa = dialog.getByRole("link", { name: "اشترك عبر واتساب" });
		const href = await wa.getAttribute("href");
		expect(href).toContain("https://wa.me/970599000000?text=");
		const text = decodeURIComponent(href!.split("text=")[1]);
		expect(text).toContain("الوحدة الثانية");
		expect(text).toContain("50 ₪");
		expect(text).toContain("رياضيات - QA");
		await expect(wa).toHaveAttribute("target", "_blank");
		// Both close buttons (the X and the outlined one) work.
		await dialog.getByRole("button", { name: "إغلاق" }).last().click();
		await expect(dialog).toHaveCount(0);
		await card(page, "فيديو الوحدة المدفوعة").click();
		await page
			.getByRole("dialog")
			.getByRole("button", { name: "إغلاق" })
			.first()
			.click();
		await expect(page.getByRole("dialog")).toHaveCount(0);
	});

	test("paid unit files: 'how to subscribe' opens the paywall", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await expect(page.getByText("ملفات هذه الوحدة للمشتركين")).toBeVisible();
		await page.getByRole("button", { name: "طريقة الاشتراك" }).click();
		await expect(page.getByRole("dialog")).toContainText("للمشتركين");
	});

	test("paid unit exam: 'subscribe' opens the paywall; the exam URL bounces", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await (await openExams(page))
			.getByRole("button", { name: "اشترك في الوحدة لفتح الامتحان" })
			.click();
		await expect(page.getByRole("dialog")).toContainText("للمشتركين");

		await page.goto(`/exam/${seed.exams["اختبار بعد كل الوحدة (TREE)"].id}`);
		await expect(page).toHaveURL(new RegExp(folderUrl(seed, seed.owned.id)));
	});

	test("lesson inside a paid unit is locked too", async ({ page }) => {
		await openFolder(page, seed.owned.lessonId);
		await card(page, "درس مدفوع").click();
		await expect(page.getByRole("dialog")).toContainText("للمشتركين");
	});

	test("free unit: files download, Bunny video plays with their email", async ({
		page,
	}) => {
		await openFolder(page, seed.free.id);
		await expect(
			page.getByRole("link", { name: /تحميل ملخص/ })
		).toHaveAttribute("href", /dummy\.pdf/);
		await openFolder(page, seed.free.lessonId);
		await card(page, "فيديو Bunny مجاني").click();
		const dialog = page.getByRole("dialog");
		await expect(dialog.locator("iframe")).toHaveAttribute(
			"src",
			/player\.mediadelivery\.net/
		);
		await expect(dialog.getByText(FREE)).toBeVisible();
	});

	test("FOLDER exam waits for the lesson's videos, then opens", async ({
		page,
	}) => {
		await openFolder(page, seed.free.lessonId);
		await expect(
			(await openExams(page)).getByText("يفتح بعد مشاهدة الفيديوهات")
		).toBeVisible();
		// Mark every lesson video done through the API, as watching would.
		for (const name of ["مقدمة", "شرح الدرس", "فيديو Bunny مجاني"])
			await page.request.post("/api/progress", {
				data: { videoId: seed.videos[name].id, completed: true },
			});
		await page.reload();
		await expect(
			(await openExams(page)).getByRole("link", { name: "ابدأ الامتحان" })
		).toBeVisible();
	});

	test("hidden admin controls are absent", async ({ page }) => {
		await openFolder(page, seed.rootId);
		await expect(
			page.getByRole("button", { name: /خيارات المجلد/ })
		).toHaveCount(0);
		await expect(page.getByRole("button", { name: "إضافة محتوى" })).toHaveCount(
			0
		);
		await page.goto("/admin/exams");
		await expect(page).toHaveURL(/^[^?]*\/$/);
	});
});

test.describe("paid student", () => {
	test.beforeEach(async ({ page }) => loginPage(page, PAID));

	test("class page: owned unit says 'مشترك', the other keeps its price", async ({
		page,
	}) => {
		await openFolder(page, seed.rootId);
		await expect(page.getByText("مشترك", { exact: true })).toBeVisible();
		await expect(page.getByText("30 ₪")).toBeVisible();
		await expect(page.getByText("50 ₪")).toHaveCount(0);
	});

	test("player: watermark fixed in the top right, never moves, fullscreen works", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await card(page, "فيديو الوحدة المدفوعة").click();
		const dialog = page.getByRole("dialog");
		const iframe = dialog.locator("iframe");
		await expect(iframe).toHaveAttribute("src", /token=[0-9a-f]{64}/);
		const mark = dialog.getByText(PAID, { exact: true });
		await expect(mark).toBeVisible();

		const box = (await iframe.boundingBox())!;
		const first = (await mark.boundingBox())!;
		// Top right corner of the player.
		expect(box.x + box.width - (first.x + first.width)).toBeLessThan(20);
		expect(first.y - box.y).toBeLessThan(20);
		// Still there after the old "move every 4s" interval would have fired.
		await page.waitForTimeout(5000);
		expect(await mark.boundingBox()).toEqual(first);
		await expect(dialog).not.toContainText("تم إيقاف الفيديو");

		await dialog.getByRole("button", { name: "ملء الشاشة" }).click();
		await expect
			.poll(() => page.evaluate(() => !!document.fullscreenElement))
			.toBe(true);
		const fsBox = (await iframe.boundingBox())!;
		const fsMark = (await mark.boundingBox())!;
		expect(fsBox.x + fsBox.width - (fsMark.x + fsMark.width)).toBeLessThan(20);
		expect(fsMark.y - fsBox.y).toBeLessThan(20);
		await page.evaluate(() => document.exitFullscreen());
	});

	test("tampering with the watermark stops the video", async ({ page }) => {
		await openFolder(page, seed.owned.id);
		await card(page, "فيديو الوحدة المدفوعة").click();
		const dialog = page.getByRole("dialog");
		await expect(dialog.getByText(PAID, { exact: true })).toBeVisible();
		await page.evaluate((email) => {
			const el = Array.from(document.querySelectorAll("div")).find(
				(d) => d.textContent === email && !d.children.length
			);
			el!.style.opacity = "0";
		}, PAID);
		await expect(dialog).toContainText("تم إيقاف الفيديو");
		await expect(dialog.locator("iframe")).toHaveCount(0);
	});

	test("closing and reopening the player starts clean", async ({ page }) => {
		await openFolder(page, seed.owned.id);
		await card(page, "فيديو الوحدة المدفوعة").click();
		await expect(page.getByRole("dialog").locator("iframe")).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(page.getByRole("dialog")).toHaveCount(0);
		await card(page, "فيديو الوحدة المدفوعة").click();
		await expect(page.getByRole("dialog").locator("iframe")).toBeVisible();
	});

	test("locked unit still shows the paywall", async ({ page }) => {
		await openFolder(page, seed.locked.id);
		await card(page, "فيديو مقفل").click();
		await expect(page.getByRole("dialog")).toContainText("«الوحدة الثالثة");
	});

	test("owned unit files have real download links", async ({ page }) => {
		await openFolder(page, seed.owned.id);
		await expect(
			page.getByRole("link", { name: /تحميل ملخص/ })
		).toHaveAttribute("href", /dummy\.pdf/);
	});

	test("TREE exam: progress panel, then mark videos done by hand to open it", async ({
		page,
	}) => {
		// Start from nothing watched (the API spec may have marked them).
		for (const name of ["فيديو الوحدة المدفوعة", "درس مدفوع"])
			await page.request.post("/api/progress", {
				data: { videoId: seed.videos[name].id, completed: false },
			});
		await openFolder(page, seed.owned.id);
		await expect(
			(await openExams(page)).getByText("يفتح بعد مشاهدة الفيديوهات")
		).toBeVisible();
		await page.keyboard.press("Escape");
		const markDone = async (name: string) => {
			const btn = page.getByRole("button", { name: `أنهيت الفيديو: ${name}` });
			await expect(btn).toHaveAttribute("aria-pressed", "false");
			await btn.click();
			await expect(btn).toHaveAttribute("aria-pressed", "true");
		};
		await markDone("فيديو الوحدة المدفوعة");
		await openFolder(page, seed.owned.lessonId);
		await markDone("درس مدفوع");
		await openFolder(page, seed.owned.id);
		await expect(
			(await openExams(page)).getByRole("link", { name: "ابدأ الامتحان" })
		).toBeVisible();
	});

	test("take an exam: answer, navigate, confirm unanswered, result, review, retake", async ({
		page,
	}) => {
		await openFolder(page, seed.owned.id);
		await (await openExams(page))
			.getByRole("link", { name: "ابدأ الامتحان" })
			.click();
		await expect(page).toHaveURL(/\/exam\//);
		await expect(page.getByText("تكامل 2x dx هو؟")).toBeVisible();

		await page
			.getByRole("radio", { name: /x² \+ c/ })
			.first()
			.check();
		await page.getByRole("button", { name: "التالي" }).click();
		await expect(page.getByText("تكامل 0 dx هو؟")).toBeVisible();
		await page
			.getByRole("radio", { name: /^.*\b0$/ })
			.first()
			.check(); // wrong (correct is c)
		await page.getByRole("button", { name: "السابق" }).click();
		await expect(
			page.getByRole("radio", { name: /x² \+ c/ }).first()
		).toBeChecked();
		// Jump straight to question 3 and leave it unanswered.
		await page.getByRole("button", { name: "سؤال 3" }).click();
		await expect(page.getByText(/نهاية 1\/x/)).toBeVisible();

		await page
			.getByRole("button", { name: /سلّم الامتحان|تسليم الامتحان/ })
			.first()
			.click();
		const confirm = page.getByRole("dialog");
		await expect(confirm).toContainText("لم تجب على 1 من 3");
		await confirm.getByRole("button", { name: "أكمل الإجابة" }).click();
		await page
			.getByRole("button", { name: /سلّم الامتحان|تسليم الامتحان/ })
			.first()
			.click();
		await page
			.getByRole("dialog")
			.getByRole("button", { name: "سلّم الآن" })
			.click();

		const result = page.getByRole("dialog", { name: "نتيجة الامتحان" });
		await expect(result).toContainText("1");
		await expect(result).toContainText("33%");
		await result.getByRole("button", { name: "راجع إجاباتك" }).click();
		await expect(
			page.getByRole("img", { name: "الإجابة الصحيحة" }).first()
		).toBeVisible();

		await page.getByRole("button", { name: "أعد الامتحان" }).click();
		await expect(
			page.getByRole("radio", { name: /x² \+ c/ }).first()
		).not.toBeChecked();
		await page.getByRole("link", { name: "رجوع للمجلد" }).first().click();
		await expect(page).toHaveURL(new RegExp(folderUrl(seed, seed.owned.id)));
		const panel = await openExams(page);
		await expect(panel.getByText(/آخر نتيجة 1\/3/)).toBeVisible();
		await expect(
			panel.getByRole("link", { name: "أعد الامتحان" })
		).toBeVisible();
	});
});

test.describe("admin", () => {
	test.beforeEach(async ({ page }) => loginPage(page, ADMIN));

	test("sees every unit open, with admin controls", async ({ page }) => {
		await openFolder(page, seed.locked.id);
		await card(page, "فيديو مقفل").click();
		await expect(page.getByRole("dialog").locator("iframe")).toBeVisible();
		await expect(page.getByRole("dialog").getByText(ADMIN)).toBeVisible();
	});

	test("unit price: set from the folder menu, then make it free again", async ({
		page,
	}) => {
		await openFolder(page, seed.rootId);
		await page
			.getByRole("button", { name: /خيارات المجلد: الوحدة الأولى/ })
			.click();
		await page.getByRole("menuitem", { name: "سعر الوحدة" }).click();
		let dialog = page.getByRole("dialog");
		const input = dialog.getByLabel("السعر (₪)");
		await input.fill("0");
		await expect(dialog.getByRole("button", { name: "حفظ" })).toBeDisabled();
		await input.fill("25");
		await dialog.getByRole("button", { name: "حفظ" }).click();
		await expect(page.getByText("تم تحديد سعر الوحدة")).toBeVisible();
		await expect(page.getByText("25 ₪")).toBeVisible();

		await page
			.getByRole("button", { name: /خيارات المجلد: الوحدة الأولى/ })
			.click();
		await page.getByRole("menuitem", { name: "سعر الوحدة" }).click();
		dialog = page.getByRole("dialog");
		await dialog.getByLabel("السعر (₪)").fill("");
		await dialog.getByRole("button", { name: "حفظ" }).click();
		await expect(page.getByText("أصبحت الوحدة مجانية")).toBeVisible();
		await expect(page.getByText("25 ₪")).toHaveCount(0);
	});

	test("new folder at the class root can be a paid unit; validation", async ({
		page,
	}) => {
		await openFolder(page, seed.rootId);
		await page.getByRole("button", { name: "إضافة محتوى" }).click();
		await page.getByRole("menuitem", { name: "مجلد جديد" }).click();
		const dialog = page.getByRole("dialog");
		await dialog.getByLabel(/اسم المجلد/).fill("وحدة QA مدفوعة");
		await dialog.getByLabel(/سعر الوحدة/).fill("0");
		await dialog.getByRole("button", { name: "إنشاء المجلد" }).click();
		await expect(
			dialog.getByText("أدخل رقماً صحيحاً بين 1 و 100000")
		).toBeVisible();
		await dialog.getByLabel(/سعر الوحدة/).fill("40");
		await dialog.getByRole("button", { name: "إنشاء المجلد" }).click();
		await expect(page.getByText("40 ₪")).toBeVisible();
	});

	test("users page: unlock a unit for the free student, then lock it again", async ({
		page,
		baseURL,
	}) => {
		await page.goto("/admin/profile");
		await page.getByRole("tab", { name: "المستخدمون" }).click();
		await page.getByRole("button", { name: `وحدات طالب مجاني` }).click();
		let dialog = page.getByRole("dialog");
		const row = dialog.getByRole("checkbox", { name: /الوحدة الثالثة.*30 ₪/ });
		await expect(row).toHaveAttribute("aria-checked", "false");
		await row.click();
		await expect(row).toHaveAttribute("aria-checked", "true");
		// Cancel throws the change away.
		await dialog.getByRole("button", { name: "إلغاء" }).click();
		await page.getByRole("button", { name: `وحدات طالب مجاني` }).click();
		dialog = page.getByRole("dialog");
		await expect(row).toHaveAttribute("aria-checked", "false");
		await row.click();
		const saved = page.waitForResponse(
			(r) => r.url().includes("/units") && r.request().method() === "PUT"
		);
		await dialog.getByRole("button", { name: "حفظ" }).click();
		expect((await saved).status()).toBe(200);
		await expect(page.getByText("تم تحديث وحدات الطالب")).toBeVisible();

		// The student gets it at once.
		const free = await client(baseURL!, FREE);
		expect(
			(
				await free.get(`/api/video/${seed.videos["فيديو مقفل"].id}/playback`)
			).status()
		).toBe(200);

		await page.getByRole("button", { name: `وحدات طالب مجاني` }).click();
		dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("checkbox", { name: /الوحدة الثالثة/ })
		).toHaveAttribute("aria-checked", "true");
		await dialog.getByRole("checkbox", { name: /الوحدة الثالثة/ }).click();
		const relocked = page.waitForResponse(
			(r) => r.url().includes("/units") && r.request().method() === "PUT"
		);
		await dialog.getByRole("button", { name: "حفظ" }).click();
		expect((await relocked).status()).toBe(200);
		expect(
			(
				await free.get(`/api/video/${seed.videos["فيديو مقفل"].id}/playback`)
			).status()
		).toBe(403);
		await free.dispose();
	});

	test("users page: 'subscribers only' filter", async ({ page }) => {
		await page.goto("/admin/profile");
		await page.getByRole("tab", { name: "المستخدمون" }).click();
		await expect(page.getByText(FREE)).toBeVisible();
		await page.getByLabel("تصفية حسب الاشتراك").click();
		await page.getByRole("option", { name: "المشتركون فقط" }).click();
		await expect(page.getByText(PAID)).toBeVisible();
		await expect(page.getByText(FREE)).toHaveCount(0);
	});

	test("question bank: add, search, edit, delete a question", async ({
		page,
	}) => {
		await page.goto("/admin/exams");
		await page.getByRole("tab", { name: "بنك الأسئلة" }).click();
		await page.getByRole("button", { name: "سؤال جديد" }).click();
		let dialog = page.getByRole("dialog");
		await dialog.getByLabel("الدرس").fill("درس واجهة QA");
		await dialog.getByLabel("نص السؤال").fill("كم يساوي 2+2؟");
		await dialog.getByLabel("نص الخيار أ").fill("3");
		await dialog.getByLabel("نص الخيار ب").fill("4");
		await dialog.getByLabel("الخيار ب هو الصحيح").check();
		// Empty options are refused with a message, not silently dropped.
		await dialog.getByRole("button", { name: "حفظ السؤال" }).click();
		await expect(
			page.getByText("يلزم من 2 إلى 6 خيارات غير فارغة")
		).toBeVisible();
		await dialog.getByRole("button", { name: "حذف الخيار د" }).click();
		await dialog.getByRole("button", { name: "حذف الخيار ج" }).click();
		await expect(dialog.getByLabel("الخيار ب هو الصحيح")).toBeChecked();
		await dialog.getByRole("button", { name: "حفظ السؤال" }).click();
		await expect(page.getByText("تمت إضافة السؤال")).toBeVisible();

		await page.getByRole("tab", { name: /درس واجهة QA/ }).click();
		await expect(page.getByText("كم يساوي 2+2؟")).toBeVisible();
		await page
			.getByPlaceholder("ابحث في نص السؤال أو المصدر")
			.fill("لا يوجد هذا");
		await expect(page.getByText("لا توجد أسئلة مطابقة")).toBeVisible();
		await page.getByPlaceholder("ابحث في نص السؤال أو المصدر").fill("2+2");

		await page.getByRole("button", { name: "تعديل السؤال" }).first().click();
		dialog = page.getByRole("dialog");
		await dialog.getByLabel("نص السؤال").fill("كم يساوي 3+3؟");
		await dialog.getByRole("button", { name: "حفظ السؤال" }).click();
		await expect(page.getByText("تم تعديل السؤال")).toBeVisible();
		await page.getByPlaceholder("ابحث في نص السؤال أو المصدر").fill("");
		await expect(page.getByText("كم يساوي 3+3؟")).toBeVisible();

		await page.getByRole("button", { name: "حذف السؤال" }).first().click();
		await page
			.getByRole("dialog", { name: "حذف السؤال" })
			.getByRole("button", { name: "حذف", exact: true })
			.click();
		await expect(page.getByText("تم حذف السؤال")).toBeVisible();
	});

	test("exams: create from the folder, edit, delete", async ({ page }) => {
		await openFolder(page, seed.locked.id);
		await (await openExams(page))
			.getByRole("button", { name: "امتحان جديد لهذا المجلد" })
			.click();
		let dialog = page.getByRole("dialog", { name: "امتحان جديد" });
		await dialog.getByLabel("عنوان الامتحان").fill("امتحان واجهة QA");
		await dialog
			.getByRole("checkbox", { name: "اختيار كل أسئلة التفاضل" })
			.check();
		await dialog.getByRole("button", { name: "حفظ الامتحان" }).click();
		await expect(page.getByText("تم إنشاء الامتحان")).toBeVisible();
		await expect(page.getByText("امتحان واجهة QA")).toBeVisible();
		await expect(page.getByText("3 سؤال").last()).toBeVisible();

		await page.getByRole("button", { name: "تعديل امتحان واجهة QA" }).click();
		dialog = page.getByRole("dialog", { name: "تعديل امتحان" });
		await dialog.getByLabel("عنوان الامتحان").fill("امتحان واجهة QA 2");
		await dialog.getByRole("button", { name: "حفظ الامتحان" }).click();
		await expect(page.getByText("تم تعديل الامتحان")).toBeVisible();

		await page.getByRole("button", { name: "حذف امتحان واجهة QA 2" }).click();
		await page
			.getByRole("dialog", { name: "حذف الامتحان" })
			.getByRole("button", { name: "حذف", exact: true })
			.click();
		await expect(page.getByText("تم حذف الامتحان")).toBeVisible();
		await expect(page.getByText("امتحان واجهة QA 2")).toHaveCount(0);
	});

	test("exams admin page lists every exam with its folder", async ({
		page,
	}) => {
		await page.goto("/admin/exams");
		await page.getByRole("tab", { name: "الامتحانات" }).click();
		for (const title of Object.keys(seed.exams))
			await expect(page.getByText(title)).toBeVisible();
	});
});

test.describe("mobile (375px)", () => {
	test.use({
		viewport: { width: 375, height: 740 },
		isMobile: true,
		hasTouch: true,
	});

	test("paywall and player fit the screen", async ({ page }) => {
		await loginPage(page, PAID);
		await openFolder(page, seed.locked.id);
		await card(page, "فيديو مقفل").click();
		const dialog = page.getByRole("dialog");
		await expect(
			dialog.getByRole("link", { name: "اشترك عبر واتساب" })
		).toBeInViewport();
		await page.keyboard.press("Escape");

		await openFolder(page, seed.owned.id);
		await card(page, "فيديو الوحدة المدفوعة").click();
		const iframe = page.getByRole("dialog").locator("iframe");
		const box = (await iframe.boundingBox())!;
		expect(box.width).toBeLessThanOrEqual(375);
		const mark = (await page
			.getByRole("dialog")
			.getByText(PAID, { exact: true })
			.boundingBox())!;
		expect(mark.x + mark.width).toBeLessThanOrEqual(box.x + box.width + 1);
		const scroll = await page.evaluate(
			() => document.documentElement.scrollWidth
		);
		expect(scroll).toBeLessThanOrEqual(375);
	});
});

test.describe("hidden class", () => {
	const hiddenFolder = (id: string) =>
		`/class/${seed.hidden.classId}/folder/${id}`;
	const hiddenUrl = () => hiddenFolder(seed.hidden.unitId);
	const hiddenExam = () => `/exam/${seed.exams["اختبار الصف المخفي"].id}`;

	for (const who of [undefined, FREE, PAID] as const)
		test(`${who ?? "guest"} is sent to the class list (folder and exam)`, async ({
			page,
		}) => {
			if (who) await loginPage(page, who);
			await page.goto(hiddenUrl());
			await expect(page).toHaveURL(/\/classes$/);
			await expect(page.getByText("وحدة الصف المخفي")).toHaveCount(0);
			await expect(page.getByText("صف مخفي - QA")).toHaveCount(0);

			await page.goto(hiddenFolder(seed.hidden.rootId));
			await expect(page).toHaveURL(/\/classes$/);

			await page.goto(hiddenExam());
			await expect(page).toHaveURL(/\/classes$/);
		});

	test("admin sees it in the list, opens it and plays its video", async ({
		page,
	}) => {
		await loginPage(page, ADMIN);
		await page.goto("/classes");
		await expect(page.getByText("صف مخفي - QA")).toBeVisible();
		await expect(page.getByText("مخفي عن الطلاب")).toBeVisible();

		await page.goto(hiddenFolder(seed.hidden.rootId));
		await expect(page.getByText("وحدة الصف المخفي")).toBeVisible();
		await page.goto(hiddenUrl());
		await expect(page).toHaveURL(new RegExp(hiddenUrl()));
		await card(page, "فيديو مخفي").click();
		await expect(page.getByRole("dialog")).toBeVisible();
		await page.keyboard.press("Escape");

		await page.goto(hiddenExam());
		await expect(page).toHaveURL(/\/exam\//);
	});

	test("showing it again opens it to students, hiding it closes it", async ({
		page,
		baseURL,
	}) => {
		const admin = await client(baseURL!, ADMIN);
		const toggle = (hidden: boolean) =>
			admin.patch("/api/class", { data: { id: seed.hidden.classId, hidden } });

		expect((await toggle(false)).status()).toBe(200);
		await loginPage(page, FREE);
		await page.goto(hiddenUrl());
		await expect(page).toHaveURL(new RegExp(hiddenUrl()));
		await expect(card(page, "فيديو مخفي")).toBeVisible();

		expect((await toggle(true)).status()).toBe(200);
		await page.goto(hiddenUrl());
		await expect(page).toHaveURL(/\/classes$/);
		await admin.dispose();
	});
});
