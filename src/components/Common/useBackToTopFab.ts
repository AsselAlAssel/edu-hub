"use client";

import { useCallback, useEffect, useState } from "react";

const SHOW_AFTER_PX = 320;

/** منطق زر العودة لأعلى: ظهور بعد التمرير + تمرير سلس للأعلى. */
export function useBackToTopFab() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(window.scrollY > SHOW_AFTER_PX);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollTop = useCallback(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
		document.getElementById("main-content")?.focus({ preventScroll: true });
	}, []);

	return { visible, scrollTop };
}
