// Usage: node scripts/screenshots.mjs <baseUrl> <outDir>
// Captures key pages at 375/768/1280 in dark and light mode (read-only).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3000", out = "screenshots"] =
	process.argv.slice(2);
const widths = [375, 768, 1280];
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

async function firstResourcePath() {
	const page = await browser.newPage();
	await page.goto(`${base}/classes`, { waitUntil: "networkidle" });
	const href = await page
		.locator("main article h2 a")
		.first()
		.getAttribute("href")
		.catch(() => null);
	await page.close();
	return href;
}

const resource = await firstResourcePath();
const pages = [
	["home", "/"],
	["classes", "/classes"],
	...(resource ? [["resources", resource]] : []),
	["signin", "/auth/signin"],
	["admin", "/admin/profile"],
	["404", "/class/not-an-id/folder/x"],
];

for (const mode of ["dark", "light"]) {
	for (const width of widths) {
		const context = await browser.newContext({
			viewport: { width, height: 900 },
			locale: "ar",
		});
		await context.addInitScript(
			(m) => localStorage.setItem("edu-hub-theme", m),
			mode
		);
		const page = await context.newPage();
		for (const [name, path] of pages) {
			await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
			// Let entrance/reveal animations settle, and trigger in-view reveals.
			await page.evaluate(async () => {
				// "instant": the site uses smooth scrolling, which would stall the sweep.
				for (let y = 0; y < document.body.scrollHeight; y += 500) {
					window.scrollTo({ top: y, behavior: "instant" });
					await new Promise((r) => setTimeout(r, 150));
				}
				window.scrollTo({ top: 0, behavior: "instant" });
			});
			await page.waitForTimeout(900);
			await page.screenshot({
				path: `${out}/${name}-${width}-${mode}.png`,
				fullPage: true,
			});
		}
		await context.close();
	}
}
await browser.close();
console.log(`saved to ${out}`);
