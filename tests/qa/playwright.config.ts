import { defineConfig, devices } from "@playwright/test";
import {
	WHATS_NEW_STORAGE_KEY,
	WHATS_NEW_VERSION,
} from "../../src/components/WhatsNew/version";

/**
 * Paid units + exams, end to end, against the QA database. Unlike tests/e2e
 * these specs write data, so global-setup reseeds edu-hub-qa first.
 *
 * Start the app on the QA DB (NEXTAUTH_URL must match the port), then:
 *   npx playwright test -c tests/qa
 */
const baseURL = process.env.QA_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
	testDir: ".",
	globalSetup: "./global-setup.ts",
	timeout: 60_000,
	expect: { timeout: 10_000 },
	// Specs share one database and change it: one at a time, in file order.
	workers: 1,
	fullyParallel: false,
	reporter: [["list"]],
	use: {
		baseURL,
		locale: "ar",
		trace: "retain-on-failure",
		storageState: {
			cookies: [],
			origins: [
				{
					origin: baseURL,
					localStorage: [
						{ name: WHATS_NEW_STORAGE_KEY, value: WHATS_NEW_VERSION },
					],
				},
			],
		},
		...devices["Desktop Chrome"],
		viewport: { width: 1280, height: 800 },
	},
});
