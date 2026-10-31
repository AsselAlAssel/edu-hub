import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			// Next resolves `server-only` itself (no npm package); tests are server code.
			"server-only": "next/dist/compiled/server-only/empty.js",
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/unit/**/*.test.{ts,tsx}"],
		css: false,
		restoreMocks: true,
	},
});
