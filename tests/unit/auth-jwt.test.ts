// @vitest-environment node
import { authOptions } from "@/libs/auth";
import { describe, expect, it, vi } from "vitest";

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock("@/libs/prismaDb", () => ({
	prisma: { session: { create: vi.fn(), deleteMany: vi.fn(), findUnique } },
}));

const jwt = authOptions.callbacks!.jwt as (payload: any) => Promise<any>;
const live = () => ({ expires: new Date(Date.now() + 60_000) });

describe("jwt callback: client session update", () => {
	const token = {
		sub: "user-1",
		uid: "user-1",
		role: "USER",
		name: "Old",
		picture: "/old.png",
		sessionId: "s-1",
	};

	it("cannot escalate role or change identity", async () => {
		findUnique.mockResolvedValueOnce(live());
		const next = await jwt({
			token,
			trigger: "update",
			session: { user: { role: "ADMIN", uid: "admin", sub: "admin" } },
		});
		expect(next.role).toBe("USER");
		expect(next.uid).toBe("user-1");
		expect(next.sub).toBe("user-1");
	});

	it("still updates the display name and image", async () => {
		findUnique.mockResolvedValueOnce(live());
		const next = await jwt({
			token,
			trigger: "update",
			session: { user: { name: "New", image: "/new.png" } },
		});
		expect(next).toMatchObject({
			name: "New",
			picture: "/new.png",
			image: "/new.png",
		});
	});
});

describe("jwt callback: one device at a time", () => {
	const token = { sub: "user-1", role: "USER", sessionId: "s-old" };

	it("rejects a token whose session was replaced by a newer sign-in", async () => {
		findUnique.mockResolvedValueOnce(null);
		await expect(jwt({ token })).rejects.toThrow();
	});

	it("rejects an expired session", async () => {
		findUnique.mockResolvedValueOnce({ expires: new Date(Date.now() - 1) });
		await expect(jwt({ token })).rejects.toThrow();
	});

	it("rejects a token without a sessionId", async () => {
		await expect(jwt({ token: { sub: "user-1" } })).rejects.toThrow();
	});

	it("keeps the current session", async () => {
		findUnique.mockResolvedValueOnce(live());
		await expect(jwt({ token })).resolves.toMatchObject(token);
	});
});
