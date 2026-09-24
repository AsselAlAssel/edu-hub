import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@mui/material/styles";
import type { LandingPage } from "@prisma/client";
import Header from "@/components/Common/Dashboard/Header";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useBackToTopFab } from "@/components/Common/useBackToTopFab";
import Landing from "@/scenes/Landing/Landing";
import { buildContactItems } from "@/scenes/Landing/components/ContactUs";
import { asAdmin, asGuest, navigationState, renderWithTheme } from "../utils";

const landing = {
	id: "x",
	headerTitle: "مرحباً بكم في عالم الفيزياء",
	headerSubtitle: "دروس وفيديوهات",
	headerImage: "https://cdn.test/hero.png",
	landingVideo: "https://youtu.be/dQw4w9WgXcQ",
	landingVideoId: "dQw4w9WgXcQ",
	aboutTitle: "عن هذه المنصة",
	aboutSubtitle: "نص تعريفي",
	aboutImage: null,
	whatsAppNumber: "972597408236",
	address: "نابلس - فلسطين",
	email: "teacher@test.dev",
} satisfies LandingPage;

beforeEach(() => {
	asGuest();
	navigationState.pathname = "/";
});

describe("landing page", () => {
	it("renders the CMS hero with one h1 and both CTAs", () => {
		renderWithTheme(<Landing data={landing} />);
		const h1s = screen.getAllByRole("heading", { level: 1 });
		expect(h1s).toHaveLength(1);
		expect(h1s[0]).toHaveTextContent(landing.headerTitle);
		expect(screen.getByRole("link", { name: /تصفّح الصفوف/ })).toHaveAttribute(
			"href",
			"/classes"
		);
		expect(
			screen.getByRole("link", { name: /تعرّف على المنصة/ })
		).toHaveAttribute("href", "/#about");
	});

	it("has the four feature cards and no fabricated progress/stat claims", () => {
		renderWithTheme(<Landing data={landing} />);
		const features = screen
			.getByRole("heading", { name: /كل ما تحتاجه/ })
			.closest("section")!;
		expect(within(features).getAllByRole("heading", { level: 3 })).toHaveLength(
			4
		);
		expect(document.body.textContent).not.toMatch(/تتبع تقدمك|إحصائيات/);
	});

	it("defers the YouTube iframe until the visitor presses play", async () => {
		renderWithTheme(<Landing data={landing} />);
		expect(document.querySelector("iframe")).toBeNull();
		await userEvent.click(
			screen.getByRole("button", { name: /تشغيل الفيديو/ })
		);
		expect(document.querySelector("iframe")?.getAttribute("src")).toContain(
			"dQw4w9WgXcQ?autoplay=1"
		);
	});

	it("hides the video section when no video is configured", () => {
		renderWithTheme(
			<Landing
				data={{ ...landing, landingVideo: null, landingVideoId: null }}
			/>
		);
		expect(screen.queryByRole("button", { name: /تشغيل الفيديو/ })).toBeNull();
	});

	it("builds correct contact links (mailto, maps, wa.me) and survives missing data", () => {
		const items = buildContactItems({
			email: "a@b.co",
			address: "نابلس",
			whatsappNumber: "+972 59-7408236",
		});
		expect(items.map((i) => i.href)).toEqual([
			"mailto:a@b.co",
			`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("نابلس")}`,
			"https://wa.me/972597408236",
		]);
		expect(items.find((i) => i.key === "email")?.external).toBe(false);
		expect(buildContactItems({})).toEqual([]);
		renderWithTheme(<Landing data={null} />);
		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
	});

	it("renders RTL: the theme direction is rtl", () => {
		let direction = "";
		const Probe = () => {
			direction = useTheme().direction;
			return null;
		};
		renderWithTheme(<Probe />);
		expect(direction).toBe("rtl");
	});
});

describe("theme switching", () => {
	it("toggles between dark and light and updates the html class", async () => {
		localStorage.clear();
		renderWithTheme(
			<NextThemesProvider
				attribute='class'
				defaultTheme='dark'
				enableSystem={false}
			>
				<ThemeToggle />
			</NextThemesProvider>
		);
		const toggle = screen.getByRole("button", {
			name: "التبديل إلى الوضع الفاتح",
		});
		await userEvent.click(toggle);
		expect(document.documentElement.classList.contains("light")).toBe(true);
		expect(
			screen.getByRole("button", { name: "التبديل إلى الوضع الداكن" })
		).toBeInTheDocument();
	});
});

describe("header & mobile navigation", () => {
	it("marks the current page with aria-current", () => {
		navigationState.pathname = "/classes";
		renderWithTheme(<Header />);
		const nav = screen.getAllByRole("navigation", {
			name: "التنقل الرئيسي",
		})[0];
		expect(within(nav).getByRole("link", { name: "الصفوف" })).toHaveAttribute(
			"aria-current",
			"page"
		);
	});

	it("opens the drawer, lists links, and closes with Escape", async () => {
		renderWithTheme(<Header />);
		await userEvent.click(screen.getByRole("button", { name: "فتح القائمة" }));
		const drawerClose = await screen.findByRole("button", {
			name: "إغلاق القائمة",
		});
		expect(screen.getByRole("link", { name: "تسجيل الدخول" })).toHaveAttribute(
			"href",
			"/auth/signin"
		);
		fireEvent.keyDown(drawerClose, { key: "Escape" });
		await vi.waitFor(() =>
			expect(screen.queryByRole("button", { name: "إغلاق القائمة" })).toBeNull()
		);
	});

	it("shows the admin dashboard entry only for admins", async () => {
		asAdmin();
		renderWithTheme(<Header />);
		await userEvent.click(screen.getByRole("button", { name: "قائمة الحساب" }));
		expect(
			await screen.findByRole("menuitem", { name: /لوحة التحكم/ })
		).toHaveAttribute("href", "/admin/profile");
	});
});

describe("reduced motion", () => {
	it("back-to-top jumps instantly when the user prefers reduced motion", () => {
		vi.spyOn(window, "matchMedia").mockImplementation(
			(query) =>
				({ matches: query.includes("reduce"), media: query }) as MediaQueryList
		);
		let scrollTop = () => {};
		const Probe = () => {
			scrollTop = useBackToTopFab().scrollTop;
			return null;
		};
		renderWithTheme(<Probe />);
		act(() => scrollTop());
		expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
	});
});
