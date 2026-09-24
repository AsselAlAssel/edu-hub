import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// ── Next.js / next-auth runtime stand-ins ─────────────────────────────────
vi.mock("next/font/google", () => {
	const font = (name: string) => () => ({
		className: `font-${name}`,
		variable: `var-${name}`,
		style: { fontFamily: name },
	});
	return { IBM_Plex_Sans_Arabic: font("plex-arabic"), Inter: font("inter") };
});

vi.mock("next/image", async () => {
	const React = await import("react");
	return {
		default: ({
			fill: _fill,
			priority: _priority,
			...props
		}: Record<string, unknown>) => React.createElement("img", props),
	};
});

vi.mock("next/link", async () => {
	const React = await import("react");
	return {
		default: React.forwardRef<HTMLAnchorElement, Record<string, unknown>>(
			function Link({ href, prefetch: _prefetch, ...props }, ref) {
				return React.createElement("a", { ...props, ref, href: String(href) });
			}
		),
	};
});

vi.mock("next-auth/react", async () => {
	const { sessionState } = await import("./utils");
	return {
		useSession: () => ({
			data: sessionState.data,
			status: sessionState.data ? "authenticated" : "unauthenticated",
		}),
		signIn: vi.fn(),
		signOut: vi.fn(),
		SessionProvider: ({ children }: { children: unknown }) => children,
	};
});

vi.mock("next/navigation", async () => {
	const { routerMock, navigationState } = await import("./utils");
	return {
		useRouter: () => routerMock,
		usePathname: () => navigationState.pathname,
		useSearchParams: () => new URLSearchParams(navigationState.search),
		useServerInsertedHTML: () => undefined,
		notFound: vi.fn(),
		redirect: vi.fn(),
	};
});

// Server action (S3 signer); components under test never reach real storage.
vi.mock("@/actions/upload", () => ({
	getSignedURL: vi.fn(async () => ({
		success: { url: "https://upload.test", key: "k" },
	})),
}));

vi.mock("nextjs-toploader/app", async () => {
	const { routerMock } = await import("./utils");
	return { useRouter: () => routerMock };
});

// jsdom lacks these browser APIs used by MUI / our hooks.
if (typeof window !== "undefined") {
	// Implementation passed to vi.fn() so `restoreMocks` keeps it between tests.
	window.matchMedia ??= vi.fn((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));
	window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
	class NoopObserver {
		observe(_target?: Element) {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	}
	// Everything is "in view" so scroll reveals resolve instead of staying hidden.
	class InViewObserver extends NoopObserver {
		constructor(private callback: IntersectionObserverCallback) {
			super();
		}
		observe(target: Element) {
			this.callback(
				[{ isIntersecting: true, intersectionRatio: 1, target } as never],
				this as unknown as IntersectionObserver
			);
		}
	}
	window.IntersectionObserver ??=
		InViewObserver as unknown as typeof IntersectionObserver;
	window.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
}

// Motion stays in the components; tests just jump every animation to its end state.
MotionGlobalConfig.skipAnimations = true;
