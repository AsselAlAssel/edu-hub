import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { SWRConfig } from "swr";
import { vi } from "vitest";
import { createEduTheme } from "../theme";

/**
 * Shared module mocks. Call `vi.mock(...)` with these factories at the top of
 * a test file (vi.mock is hoisted, so factories must be self-contained).
 */
export const sessionState: {
	data: { user: Record<string, unknown> } | null;
} = { data: null };

export const asAdmin = () => {
	sessionState.data = {
		user: {
			id: "a".repeat(24),
			name: "Admin",
			email: "admin@test.dev",
			role: "ADMIN",
		},
	};
};
export const asUser = () => {
	sessionState.data = {
		user: {
			id: "b".repeat(24),
			name: "Student",
			email: "s@test.dev",
			role: "USER",
		},
	};
};
export const asGuest = () => {
	sessionState.data = null;
};

export const navigationState = { pathname: "/", search: "" };

export const routerMock = {
	push: vi.fn(),
	replace: vi.fn(),
	refresh: vi.fn(),
	back: vi.fn(),
	prefetch: vi.fn(),
};

export function renderWithTheme(
	ui: ReactElement,
	{
		mode = "dark",
		...options
	}: RenderOptions & { mode?: "light" | "dark" } = {}
) {
	const theme = createEduTheme("rtl", mode);
	const Wrapper = ({ children }: { children: ReactNode }) => (
		// Fresh SWR cache per test: no data bleeds between tests.
		<SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
			<ThemeProvider theme={theme}>
				<div dir='rtl'>{children}</div>
			</ThemeProvider>
		</SWRConfig>
	);
	return render(ui, { wrapper: Wrapper, ...options });
}

export const oid = (seed: string) => seed.repeat(24).slice(0, 24);
