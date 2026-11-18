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
		await expect(
			dialog.getByRole("heading", { name: "3 وحدات مدفوعة في المنصة" })
		).toBeVisible();
		await expect(dialog.getByRole("button", { name: "إغلاق" })).toBeDisabled();
		await expect(dialog.getByRole("button", { name: "تخطّي" })).toHaveCount(0);

		// A visitor must step through every announcement before dismissing it.
		for (const title of ["توزيع الوحدات حسب التوجيهي", "للاشتراك بالوحدات"]) {
			await dialog.getByRole("button", { name: "التالي" }).click();
			await expect(dialog.getByRole("heading", { name: title })).toBeVisible();
		}
		await expect(
			dialog.getByRole("button", { name: "سجّل دخولك", exact: true })
		).toBeVisible();
		await expect(dialog.getByRole("button", { name: "إغلاق" })).toBeEnabled();
		await expect(dialog.getByRole("button", { name: "تخطّي" })).toBeVisible();

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
			dialog.getByRole("heading", { name: "توزيع الوحدات حسب التوجيهي" })
		).toBeVisible();
		await page.keyboard.press("ArrowRight");
		await expect(
			dialog.getByRole("heading", { name: "3 وحدات مدفوعة في المنصة" })
		).toBeVisible();
	});
});
