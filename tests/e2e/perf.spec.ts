import { devices, expect, test, type Page } from "@playwright/test";

/**
 * Paint-timing budgets. Runs in its own "perf" project AFTER every other
 * project has finished (see playwright.config.ts), one test at a time, so
 * parallel test load cannot distort the numbers. Budgets are Google's "good"
 * Core Web Vitals thresholds.
 */
test.describe.configure({ mode: "serial" });

const paintTimings = (page: Page) =>
	page.evaluate(
		() =>
			new Promise<{ fcp: number; lcp: number }>((resolve) => {
				let lcp = -1;
				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					lcp = entries[entries.length - 1].startTime;
				}).observe({ type: "largest-contentful-paint", buffered: true });
				// Let the hero entrance finish so the final LCP entry is recorded.
				setTimeout(() => {
					const fcp =
						performance.getEntriesByName("first-contentful-paint")[0]
							?.startTime ?? -1;
					resolve({ fcp, lcp });
				}, 1500);
			})
	);

for (const [name, options] of [
	["desktop", { viewport: { width: 1280, height: 800 } }],
	["mobile", { ...devices["Pixel 5"], viewport: { width: 375, height: 740 } }],
] as const) {
	test(`landing page is cached and paints fast (${name})`, async ({
		browser,
	}) => {
		const context = await browser.newContext(options);
		const page = await context.newPage();
		// Warm-up visit: primes the server cache and the connection.
		await page.goto("/");
		await context.clearCookies();

		const response = await page.goto("/", { waitUntil: "load" });
		// ISR: Next marks cached pages with x-nextjs-cache (HIT/STALE).
		expect(response?.headers()["x-nextjs-cache"]).toMatch(/HIT|STALE/);

		const { fcp, lcp } = await paintTimings(page);
		expect(fcp).toBeGreaterThan(0);
		expect(fcp, "FCP (ms)").toBeLessThan(1800);
		expect(lcp).toBeGreaterThan(0);
		expect(lcp, "LCP (ms)").toBeLessThan(2500);
		await context.close();
	});
}
