"use client";
import { useEffect, type RefObject } from "react";

/**
 * Bunny's own fullscreen button takes only the iframe fullscreen, which leaves
 * the watermark behind. Swap it for the whole player box; pressing it again
 * while the box is fullscreen exits. The click inside the iframe also
 * activates this page, so the box may request fullscreen.
 */
export default function useBoxFullscreen(
	box: RefObject<HTMLDivElement | null>,
	active: boolean
) {
	useEffect(() => {
		if (!active) return;
		let previous: Element | null = document.fullscreenElement;
		const onChange = async () => {
			const b = box.current;
			const current = document.fullscreenElement;
			const wasBox = previous === b;
			previous = current;
			if (!b || !current || current === b || !b.contains(current)) return;
			await document.exitFullscreen();
			if (wasBox) {
				if (document.fullscreenElement) await document.exitFullscreen();
				return;
			}
			await b.requestFullscreen().catch(() => {});
		};
		document.addEventListener("fullscreenchange", onChange);
		return () => document.removeEventListener("fullscreenchange", onChange);
	}, [box, active]);
}
