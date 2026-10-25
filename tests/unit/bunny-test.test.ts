// @vitest-environment node
import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({
	current: null as null | { user: Record<string, unknown> },
}));

vi.mock("@/libs/auth", () => ({ authOptions: {} }));
vi.mock("next-auth", () => ({
	getServerSession: vi.fn(async () => session.current),
}));

import { GET } from "@/app/api/bunny-test/playback/route";
import { signBunnyEmbedUrl } from "@/libs/bunny";

const KEY = "4742a81b-bf15-42fe-8b1c-8fcb9024c550";
const VIDEO = "32d140e2-e4f4-4eec-9d53-20371e9be607";

describe("signBunnyEmbedUrl", () => {
	it("hashes key + videoId + expires and builds the player URL", () => {
		const url = new URL(
			signBunnyEmbedUrl({
				libraryId: "759",
				videoId: VIDEO,
				tokenKey: KEY,
				expires: 1623440202,
			})
		);
		expect(url.origin + url.pathname).toBe(
			`https://player.mediadelivery.net/embed/759/${VIDEO}`
		);
		expect(url.searchParams.get("expires")).toBe("1623440202");
		expect(url.searchParams.get("token")).toBe(
			createHash("sha256").update(`${KEY}${VIDEO}1623440202`).digest("hex")
		);
	});
});

describe("GET /api/bunny-test/playback", () => {
	beforeEach(() => {
		session.current = null;
		vi.stubEnv("BUNNY_LIBRARY_ID", "759");
		vi.stubEnv("BUNNY_TOKEN_KEY", KEY);
		vi.stubEnv("BUNNY_TEST_VIDEO_ID", VIDEO);
		vi.stubEnv("BUNNY_TEST_EMAIL", "Tester@Example.com");
	});

	it("rejects other signed-in accounts with 403", async () => {
		session.current = { user: { id: "u", email: "other@example.com" } };
		expect((await GET()).status).toBe(403);
	});

	it("rejects everyone when BUNNY_TEST_EMAIL is unset", async () => {
		session.current = { user: { id: "u", email: "tester@example.com" } };
		vi.stubEnv("BUNNY_TEST_EMAIL", "");
		expect((await GET()).status).toBe(403);
	});

	it("rejects signed-out callers with 401", async () => {
		const res = await GET();
		expect(res.status).toBe(401);
		expect(JSON.stringify(await res.json())).not.toContain(KEY);
	});

	it("returns 500 when config is missing", async () => {
		session.current = { user: { id: "u", email: "tester@example.com" } };
		vi.stubEnv("BUNNY_TOKEN_KEY", "");
		expect((await GET()).status).toBe(500);
	});

	it("returns a short-lived signed URL without leaking the key", async () => {
		session.current = { user: { id: "u", email: "tester@example.com" } };
		const res = await GET();
		const body = await res.json();
		const left = body.expires - Math.floor(Date.now() / 1000);
		expect(res.status).toBe(200);
		expect(left).toBeGreaterThan(0);
		expect(left).toBeLessThanOrEqual(300);
		expect(body.url).toContain(`expires=${body.expires}`);
		expect(JSON.stringify(body)).not.toContain(KEY);
	});
});
