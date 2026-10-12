import { expect, test } from "@playwright/test";

// A first-time visitor: no "seen" flag (the config sets it for every other spec).
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("what's new dialog", () => {
	test("shows once, walks through the slides and remembers it", async ({
		page,
	}) => {
		await page.goto("/classes");
		const dialog = page.getByRole("dialog", { name: "ما الجديد في المنصة؟" });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText("سجّل دخولك بنقرة واحدة")).toBeVisible();

		// Next ×3 reaches the last slide; a guest gets the sign-in call to action.
		for (const title of [
			"كل فيديو تُنهيه يُحفظ تلقائيًا",
			"أكمِل من حيث توقفت",
			"تابع تقدّمك في كل صف",
		]) {
			await dialog.getByRole("button", { name: "التالي" }).click();
			await expect(dialog.getByText(title)).toBeVisible();
		}
		await expect(
			// exact: the slide dots' labels also contain the slide titles.
			dialog.getByRole("button", { name: "سجّل دخولك", exact: true })
		).toBeVisible();

		// The slide never makes the page scroll sideways (phones included).
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);

		await dialog.getByRole("button", { name: "إغلاق" }).click();
		await expect(dialog).toBeHidden();

		// Seen: it doesn't come back on the next page.
		await page.goto("/");
		await page.waitForTimeout(2000);
		await expect(page.getByRole("dialog")).toHaveCount(0);
	});

	test("arrow keys follow the reading direction", async ({ page }) => {
		await page.goto("/classes");
		const dialog = page.getByRole("dialog", { name: "ما الجديد في المنصة؟" });
		await expect(dialog).toBeVisible();
		await dialog.getByRole("button", { name: "التالي" }).focus();
		await page.keyboard.press("ArrowLeft");
		await expect(
			dialog.getByText("كل فيديو تُنهيه يُحفظ تلقائيًا")
		).toBeVisible();
		await page.keyboard.press("ArrowRight");
		await expect(dialog.getByText("سجّل دخولك بنقرة واحدة")).toBeVisible();
	});

	test("stays off the sign-in page", async ({ page }) => {
		await page.goto("/auth/signin");
		await page.waitForTimeout(2000);
		await expect(page.getByRole("dialog")).toHaveCount(0);
	});
});
