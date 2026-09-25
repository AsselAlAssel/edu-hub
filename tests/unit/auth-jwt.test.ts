// @vitest-environment node
import { authOptions } from "@/libs/auth";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/libs/prismaDb", () => ({
	prisma: { session: { create: vi.fn(), deleteMany: vi.fn() } },
}));

const jwt = authOptions.callbacks!.jwt as (payload: any) => Promise<any>;

describe("jwt callback: client session update", () => {
	const token = {
		sub: "user-1",
		uid: "user-1",
		role: "USER",
		name: "Old",
		picture: "/old.png",
	};

	it("cannot escalate role or change identity", async () => {
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
