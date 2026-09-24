import { expect, test, type Page } from "@playwright/test";

const noHorizontalScroll = async (page: Page) => {
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth
	);
	expect(overflow).toBeLessThanOrEqual(0);
};

test.describe("landing", () => {
	test("renders RTL with one h1, primary CTAs and all sections", async ({
		page,
	}, testInfo) => {
		await page.goto("/");
		await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
		await expect(page.locator("html")).toHaveAttribute("lang", "ar");
		await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
		await expect(
			page.getByRole("link", { name: /تصفّح الصفوف/ })
		).toBeVisible();
		for (const id of ["home", "features", "about", "contact"]) {
			await expect(page.locator(`#${id}`)).toBeAttached();
		}
		await expect(page.locator("iframe")).toHaveCount(0);
		await noHorizontalScroll(page);
		await page.screenshot({
			path: testInfo.outputPath(`landing-${testInfo.project.name}.png`),
			fullPage: true,
		});
	});

	test("has canonical + Open Graph metadata", async ({ page }) => {
		await page.goto("/");
		// Root canonical is the bare origin taken from NEXT_PUBLIC_DOMAIN.
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			/^https?:\/\/[^/]+\/?$/
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			"content",
			/cover\.png/
		);
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
			"content",
			"summary_large_image"
		);
	});

	test("layout stays stable while loading (CLS < 0.1)", async ({ page }) => {
		await page.addInitScript(() => {
			(window as unknown as { __cls: number }).__cls = 0;
			new PerformanceObserver((list) => {
				for (const entry of list.getEntries() as (PerformanceEntry & {
					value: number;
					hadRecentInput: boolean;
				})[]) {
					if (!entry.hadRecentInput)
						(window as unknown as { __cls: number }).__cls += entry.value;
				}
			}).observe({ type: "layout-shift", buffered: true });
		});
		await page.goto("/", { waitUntil: "networkidle" });
		await page.waitForTimeout(500);
		const cls = await page.evaluate(
			() => (window as unknown as { __cls: number }).__cls
		);
		expect(cls).toBeLessThan(0.1);
	});

	test("respects prefers-reduced-motion", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");
		const duration = await page
			.getByRole("heading", { level: 1 })
			.evaluate((el) => getComputedStyle(el.parentElement!).animationDuration);
		expect(parseFloat(duration)).toBeLessThan(0.01);
	});
});

test.describe("theme & keyboard", () => {
	test("theme toggle switches and persists across reloads", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.locator("html")).toHaveClass(/dark/);
		await page
			.getByRole("button", { name: "التبديل إلى الوضع الفاتح" })
			.click();
		await expect(page.locator("html")).toHaveClass(/light/);
		await page.reload();
		await expect(page.locator("html")).toHaveClass(/light/);
	});

	test("skip link is the first tab stop and moves focus to main", async ({
		page,
	}) => {
		await page.goto("/classes");
		await page.keyboard.press("Tab");
		const skip = page.getByRole("link", { name: "انتقل إلى المحتوى" });
		await expect(skip).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(page.locator("#main-content")).toBeFocused();
	});
});

test.describe("classes & resources", () => {
	test("catalog loads and, if classes exist, breadcrumbs lead back", async ({
		page,
	}, testInfo) => {
		await page.goto("/classes");
		await expect(
			page.getByRole("heading", { level: 1, name: "الصفوف الدراسية" })
		).toBeVisible();
		await noHorizontalScroll(page);
		await page.screenshot({
			path: testInfo.outputPath(`classes-${testInfo.project.name}.png`),
			fullPage: true,
		});

		const firstClass = page.locator("main article h2 a").first();
		if ((await firstClass.count()) === 0) {
			await expect(page.getByText("لا توجد صفوف بعد")).toBeVisible();
			return;
		}
		const name = (await firstClass.textContent())?.trim() ?? "";
		await firstClass.click();
		await expect(page).toHaveURL(/\/class\/[a-f\d]{24}\/folder\/[a-f\d]{24}/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
		await noHorizontalScroll(page);
		await page.screenshot({
			path: testInfo.outputPath(`resources-${testInfo.project.name}.png`),
			fullPage: true,
		});

		await page
			.getByRole("navigation", { name: "مسار التنقل" })
			.getByRole("link", { name: "الصفوف" })
			.click();
		await expect(page).toHaveURL(/\/classes$/);
	});

	test("unknown or malformed folder URLs render the in-site 404", async ({
		page,
	}) => {
		await page.goto("/class/not-an-id/folder/also-bad");
		await expect(
			page.getByRole("heading", { name: "الصفحة غير موجودة" })
		).toBeVisible();
		await expect(page.getByRole("banner")).toBeVisible();
	});
});

test.describe("authentication", () => {
	test("sign-in validates in Arabic without contacting the server", async ({
		page,
	}) => {
		await page.goto("/auth/signin");
		await page.getByRole("button", { name: "تسجيل الدخول" }).click();
		await expect(page.getByText("البريد الإلكتروني مطلوب")).toBeVisible();
		await page.getByLabel(/البريد الإلكتروني/).fill("x@y");
		await page.getByRole("button", { name: "إظهار كلمة المرور" }).click();
		await expect(page.getByLabel(/كلمة المرور/).first()).toHaveAttribute(
			"type",
			"text"
		);
	});

	test("admin area redirects guests to sign-in", async ({ page }) => {
		await page.goto("/admin/profile");
		await expect(page).toHaveURL(/\/auth\/signin/);
	});
});

test.describe("mobile navigation", () => {
	test.skip(({ isMobile }) => !isMobile, "mobile only");

	test("drawer opens, navigates and closes", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "فتح القائمة" }).click();
		const drawer = page
			.getByRole("navigation", { name: "التنقل الرئيسي" })
			.last();
		await drawer.getByRole("link", { name: "الصفوف" }).click();
		await expect(page).toHaveURL(/\/classes$/);
		await expect(
			page.getByRole("button", { name: "إغلاق القائمة" })
		).toBeHidden();
	});
});

test.describe("API authorization", () => {
	test("write and user endpoints reject anonymous callers", async ({
		request,
	}) => {
		expect(
			(await request.post("/api/folder", { data: { name: "x" } })).status()
		).toBe(401);
		expect(
			(
				await request.delete("/api/file", { data: { fileId: "a".repeat(24) } })
			).status()
		).toBe(401);
		expect((await request.get("/api/user")).status()).toBe(401);
		expect((await request.get("/api/user/get-all")).status()).toBe(401);
		expect((await request.get("/api/resources/not-an-id")).status()).toBe(400);
	});
});
