import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);

/**
 * E2E runs against a production build (`next build` then `next start`).
 * Specs are read-only: they never create, edit or delete data.
 * Set E2E_BASE_URL to test an already running deployment instead.
 */
const localServer = {
	command: `npx next start -p ${PORT}`,
	url: `http://localhost:${PORT}`,
	timeout: 120_000,
	reuseExistingServer: !process.env.CI,
	env: { NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next" },
};
const webServer = process.env.E2E_BASE_URL ? undefined : localServer;

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 60_000,
	expect: { timeout: 10_000 },
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: [["list"]],
	use: {
		baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`,
		locale: "ar",
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "desktop",
			testIgnore: /perf\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 800 },
			},
		},
		{
			name: "mobile",
			testIgnore: /perf\.spec\.ts/,
			use: { ...devices["Pixel 5"], viewport: { width: 375, height: 740 } },
		},
		// Timing budgets run last, on an otherwise idle machine.
		{
			name: "perf",
			testMatch: /perf\.spec\.ts/,
			dependencies: ["desktop", "mobile"],
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer,
});
