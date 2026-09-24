import { expect, test, type Page } from "@playwright/test";

/**
 * Full read-only sweep of every public page: rendering, design invariants,
 * interactions, SEO and runtime errors. Never creates, edits or deletes data.
 */

const collectErrors = (page: Page) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() !== "error") return;
		const text = message.text();
		// Third-party network noise (analytics / YouTube thumbnails) is not ours.
		if (
			/googletagmanager|google-analytics|ytimg|Failed to load resource/.test(
				text
			)
		)
			return;
		errors.push(text);
	});
	return errors;
};

const noHorizontalScroll = async (page: Page) =>
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth
		)
	).toBeLessThanOrEqual(0);

/** Sweeps the page so every scroll reveal plays, then returns to the top. */
const scrollThrough = async (page: Page) => {
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 500) {
			window.scrollTo({ top: y, behavior: "instant" });
			await new Promise((resolve) => setTimeout(resolve, 80));
		}
		window.scrollTo({ top: 0, behavior: "instant" });
	});
};

const jsonLd = (page: Page) =>
	page.$$eval('script[type="application/ld+json"]', (nodes) =>
		nodes.map((node) => JSON.parse(node.textContent || "null"))
	);

/** First class card link, or null when the catalogue is empty. */
const firstFolderUrl = async (page: Page) => {
	await page.goto("/classes");
	const link = page.locator("main article h2 a").first();
	return (await link.count()) ? link.getAttribute("href") : null;
};

test.describe("every public page", () => {
	for (const path of ["/", "/classes", "/auth/signin"]) {
		test(`${path} renders cleanly`, async ({ page }) => {
			const errors = collectErrors(page);
			await page.goto(path);
			await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
			await expect(page.getByRole("banner")).toBeVisible();
			await expect(page.locator("main#main-content")).toBeVisible();
			await scrollThrough(page);
			await noHorizontalScroll(page);
			// Every image is either described or explicitly decorative.
			expect(
				await page.locator("main img:not([alt])").count(),
				"images without alt"
			).toBe(0);
			// Every button has an accessible name.
			const unnamed = await page.$$eval(
				"button",
				(buttons) =>
					buttons.filter(
						(button) =>
							!button.getAttribute("aria-label") &&
							!button.textContent?.trim() &&
							!button.getAttribute("title")
					).length
			);
			expect(unnamed, "buttons without a name").toBe(0);
			expect(errors, errors.join("\n")).toEqual([]);
		});
	}
});

test.describe("landing page", () => {
	test("hero, sections, CTAs and real stats", async ({ page }) => {
		await page.goto("/");
		const hero = page.locator("#home");
		await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(hero.locator(".qa-gradient-text").first()).toBeVisible();
		await expect(hero.getByText("منصة الفيزياء التعليمية")).toBeVisible();
		// Stats only ever show real, positive numbers.
		for (const value of await hero.locator("dd").allTextContents())
			expect(Number(value.replace(/\D/g, ""))).toBeGreaterThan(0);

		await scrollThrough(page);
		for (const id of ["features", "about", "contact"]) {
			const heading = page.locator(`#${id} h2`).first();
			await heading.scrollIntoViewIfNeeded();
			await expect(heading).toHaveCSS("opacity", "1");
		}
		await expect(page.locator("#features li")).toHaveCount(4);

		await page.getByRole("link", { name: /تعرف علينا/ }).click();
		await expect(page).toHaveURL(/#about$/);
		await page.getByRole("link", { name: /استكشف الصفوف/ }).click();
		await expect(page).toHaveURL(/\/classes$/);
	});

	test("contact links are real and safe", async ({ page }) => {
		await page.goto("/");
		const contact = page.locator("#contact");
		await contact.scrollIntoViewIfNeeded();
		const links = contact.locator("a");
		for (let index = 0; index < (await links.count()); index++) {
			const link = links.nth(index);
			const href = (await link.getAttribute("href")) ?? "";
			expect(href).toMatch(/^(mailto:|https:\/\/)/);
			if ((await link.getAttribute("target")) === "_blank")
				expect(await link.getAttribute("rel")).toContain("noopener");
		}
	});

	test("YouTube loads only after pressing play", async ({ page }) => {
		await page.goto("/");
		const play = page.getByRole("button", { name: /تشغيل الفيديو/ }).first();
		if (!(await play.count())) test.skip(true, "no intro video configured");
		await expect(page.locator("iframe")).toHaveCount(0);
		await play.scrollIntoViewIfNeeded();
		await play.click();
		await expect(
			page.locator('iframe[src*="youtube-nocookie.com"]')
		).toHaveCount(1);
	});

	test("scroll progress bar exists on the landing page only", async ({
		page,
	}) => {
		const bar = 'header div[aria-hidden="true"][style*="scale"]';
		await page.goto("/");
		await expect(page.locator(bar)).toHaveCount(1);
		await page.goto("/classes");
		await expect(page.locator(bar)).toHaveCount(0);
	});
});

test.describe("theme", () => {
	test("every surface follows the toggle live, on every page", async ({
		page,
	}) => {
		for (const path of ["/", "/classes"]) {
			await page.goto(path);
			const footer = page.locator("footer").first();
			const toggle = page.getByRole("button", { name: /التبديل إلى/ });
			const start = await footer.evaluate(
				(el) => getComputedStyle(el).backgroundColor
			);
			await toggle.click();
			await expect(footer).not.toHaveCSS("background-color", start);
			await toggle.click();
			await expect(footer).toHaveCSS("background-color", start);
		}
	});
});

test.describe("classes & resources", () => {
	test("class cards link to their folders", async ({ page }) => {
		const errors = collectErrors(page);
		await page.goto("/classes");
		const cards = page.locator("main article");
		if (!(await cards.count())) {
			await expect(page.getByText("لا توجد صفوف بعد")).toBeVisible();
			return;
		}
		for (const href of await cards
			.locator("h2 a")
			.evaluateAll((links) => links.map((link) => link.getAttribute("href"))))
			expect(href).toMatch(/^\/class\/[a-f\d]{24}\/folder\/[a-f\d]{24}$/);
		await cards.first().hover();
		expect(errors).toEqual([]);
	});

	test("resource page: sections, files, video player", async ({ page }) => {
		const url = await firstFolderUrl(page);
		test.skip(!url, "no classes in the database");
		const errors = collectErrors(page);
		await page.goto(url!);

		await expect(
			page.getByRole("navigation", { name: "مسار التنقل" })
		).toBeVisible();
		await scrollThrough(page);
		await noHorizontalScroll(page);

		// Downloadable files open safely in a new tab.
		const downloads = page.locator('[data-testid="file-card"] a[download]');
		for (let index = 0; index < (await downloads.count()); index++) {
			const link = downloads.nth(index);
			expect(await link.getAttribute("rel")).toContain("noopener");
			expect(await link.getAttribute("href")).toMatch(/^https?:\/\//);
		}

		// Sub-folders navigate; videos open a labelled, closable player dialog.
		const folder = page.locator('[data-testid="folder-card"] a').first();
		const video = page.getByRole("button", { name: /تشغيل الفيديو/ }).first();
		if (await video.count()) {
			await video.click();
			const dialog = page.getByRole("dialog");
			await expect(dialog).toBeVisible();
			await page.keyboard.press("Escape");
			await expect(dialog).toBeHidden();
		}
		if (await folder.count()) {
			const href = await folder.getAttribute("href");
			await folder.click();
			await expect(page).toHaveURL(new RegExp(`${href}$`));
			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		}
		expect(errors, errors.join("\n")).toEqual([]);
	});
});

test.describe("SEO", () => {
	test("robots, sitemap and manifest", async ({ request }) => {
		const robots = await (await request.get("/robots.txt")).text();
		expect(robots).toContain("Disallow: /admin");
		expect(robots).toContain("Disallow: /api");
		expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);

		const sitemap = await (await request.get("/sitemap.xml")).text();
		expect(sitemap).toContain("<urlset");
		expect(sitemap).toContain("/classes");

		const manifest = await (await request.get("/manifest.webmanifest")).json();
		expect(manifest).toMatchObject({ lang: "ar", dir: "rtl" });
	});

	test("titles, descriptions, canonicals and structured data", async ({
		page,
	}) => {
		const url = await firstFolderUrl(page);
		const pages = ["/", "/classes", ...(url ? [url] : [])];
		const titles = new Set<string>();
		for (const path of pages) {
			await page.goto(path);
			const title = await page.title();
			expect(title.length).toBeGreaterThan(10);
			titles.add(title);
			expect(
				await page.locator('meta[name="description"]').getAttribute("content")
			).toBeTruthy();
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				/^https?:\/\//
			);
			await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
			expect((await jsonLd(page)).length).toBeGreaterThan(0);
		}
		expect(titles.size, "every page has its own title").toBe(pages.length);

		await page.goto("/");
		const types = (await jsonLd(page)).flat().map((item) => item["@type"]);
		expect(types).toEqual(
			expect.arrayContaining(["WebSite", "EducationalOrganization"])
		);
		if (url) {
			await page.goto(url);
			const crumbs = (await jsonLd(page)).flat();
			expect(crumbs[0]["@type"]).toBe("BreadcrumbList");
		}
	});

	test("private pages are not indexable", async ({ page }) => {
		await page.goto("/auth/signin");
		const robots = await page
			.locator('meta[name="robots"]')
			.getAttribute("content");
		expect(robots).toContain("noindex");
	});
});
