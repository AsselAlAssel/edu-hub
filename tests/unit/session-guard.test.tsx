import { render, waitFor } from "@testing-library/react";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SessionGuard, {
	logout,
	reportUnauthorized,
} from "@/components/Auth/SessionGuard";
import { Providers } from "@/app/(site)/providers";
import { asAdmin, asGuest, routerMock } from "../utils";

/** An axios call that comes back with this status, through the real interceptors. */
const callApi = (status: number) =>
	axios
		.get("/api/x", {
			adapter: async (config: InternalAxiosRequestConfig) => {
				throw new AxiosError("x", "ERR", config, null, {
					status,
					statusText: "",
					headers: {},
					config,
					data: {},
				});
			},
		})
		.catch(() => {});

beforeEach(() => {
	localStorage.clear();
	vi.mocked(signOut)
		.mockReset()
		.mockResolvedValue(undefined as never);
	routerMock.replace.mockReset();
	vi.spyOn(toast, "error");
});

const expectKicked = async () => {
	await waitFor(() => expect(routerMock.replace).toHaveBeenCalledWith("/"));
	expect(signOut).toHaveBeenCalledWith({ redirect: false });
	expect(toast.error).toHaveBeenCalledTimes(1);
	expect(localStorage.getItem("signed-in")).toBeNull();
};

describe("SessionGuard", () => {
	it("is mounted by the app's real Providers", async () => {
		asAdmin();
		render(<Providers>page</Providers>);
		await callApi(401);
		await expectKicked();
	});

	it("signs out and goes home when a signed-in user gets a 401", async () => {
		asAdmin();
		render(<SessionGuard />);
		await callApi(401);
		await expectKicked();
	});

	it("kicks only once for a burst of 401s", async () => {
		asAdmin();
		render(<SessionGuard />);
		await Promise.all([callApi(401), callApi(401), callApi(401)]);
		await expectKicked();
		expect(signOut).toHaveBeenCalledTimes(1);
	});

	it("also catches a 401 from fetch (reportUnauthorized)", async () => {
		asAdmin();
		render(<SessionGuard />);
		reportUnauthorized();
		await expectKicked();
	});

	it("kicks on a fresh page load when the session comes back empty", async () => {
		// This browser was signed in before; the other device revoked it.
		localStorage.setItem("signed-in", "1");
		asGuest();
		render(<SessionGuard />);
		await expectKicked();
	});

	it("leaves guests alone on a 401", async () => {
		asGuest();
		render(<SessionGuard />);
		await callApi(401);
		expect(signOut).not.toHaveBeenCalled();
		expect(routerMock.replace).not.toHaveBeenCalled();
		expect(toast.error).not.toHaveBeenCalled();
	});

	it("ignores other errors", async () => {
		asAdmin();
		render(<SessionGuard />);
		await callApi(403);
		await callApi(500);
		expect(signOut).not.toHaveBeenCalled();
	});

	it("shows no 'session ended' after the user's own logout", async () => {
		asAdmin();
		const { rerender } = render(<SessionGuard />);
		await logout();
		expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
		asGuest();
		rerender(<SessionGuard />);
		await callApi(401);
		expect(toast.error).not.toHaveBeenCalled();
		expect(routerMock.replace).not.toHaveBeenCalled();
	});
});
