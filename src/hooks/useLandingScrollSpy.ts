"use client";

import { APP_BAR_HEIGHT } from "@/constants/appShell";
import {
	LANDING_NAV_SECTION_IDS as SECTION_IDS,
	type LandingSectionId,
} from "@/types/landingNav";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export type { LandingSectionId };

const ACTIVATION_LINE = APP_BAR_HEIGHT + 56;

function readScrollY(): number {
	if (typeof window === "undefined") return 0;
	const doc = document.documentElement;
	return (
		window.scrollY ??
		window.pageYOffset ??
		doc.scrollTop ??
		document.body.scrollTop ??
		0
	);
}

function computeActiveSection(): LandingSectionId {
	if (typeof document === "undefined") return "home";

	const doc = document.documentElement;
	const scrollY = readScrollY();
	const innerH = window.visualViewport?.height ?? window.innerHeight;
	const scrollBottom = scrollY + innerH;

	if (scrollBottom >= doc.scrollHeight - 80) {
		return "contact";
	}

	let current: LandingSectionId = "home";
	for (const id of SECTION_IDS) {
		const el = document.getElementById(id);
		if (!el) continue;
		if (el.getBoundingClientRect().top <= ACTIVATION_LINE) current = id;
	}
	return current;
}

/**
 * يحدّد قسم الصفحة الرئيسية تحت الهيدر (scroll spy).
 * يستمع لعدة مصادر تمرير لأن بعض المتصفحات/الإعدادات لا ترسل `scroll` على `window` فقط.
 */
export function useLandingScrollSpy(enabled: boolean): LandingSectionId {
	const pathName = usePathname();
	const [active, setActive] = useState<LandingSectionId>("home");

	useLayoutEffect(() => {
		if (!enabled) {
			setActive("home");
			return;
		}

		let raf = 0;
		const sync = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const next = computeActiveSection();
				setActive((prev) => (prev === next ? prev : next));
			});
		};

		const onScroll = () => sync();

		window.addEventListener("scroll", onScroll, { passive: true });
		document.addEventListener("scroll", onScroll, { passive: true, capture: true });
		window.visualViewport?.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });

		const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
			(n): n is HTMLElement => n instanceof HTMLElement,
		);

		const observer = new IntersectionObserver(onScroll, {
			root: null,
			rootMargin: `-${ACTIVATION_LINE}px 0px -42% 0px`,
			threshold: [0, 0.05, 0.1, 0.25, 0.5, 1],
		});
		for (const el of elements) observer.observe(el);

		sync();
		const t1 = window.setTimeout(sync, 50);
		const t2 = window.setTimeout(sync, 400);

		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(t1);
			window.clearTimeout(t2);
			window.removeEventListener("scroll", onScroll);
			document.removeEventListener("scroll", onScroll, true);
			window.visualViewport?.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			observer.disconnect();
		};
	}, [enabled, pathName]);

	return active;
}
