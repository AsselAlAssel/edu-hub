import { execSync } from "node:child_process";

/** Fresh QA data for every run (the seed refuses any non *-qa database). */
export default function globalSetup() {
	execSync("node --env-file=.env.qa.local scripts/seed-qa.mts", {
		stdio: "inherit",
	});
}
