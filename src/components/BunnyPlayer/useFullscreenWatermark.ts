"use client";
import { useEffect, type RefObject } from "react";

/**
 * Bunny's own fullscreen button takes only the iframe fullscreen, which would
 * leave the watermark behind. While it is, the watermark becomes a popover:
 * the top layer draws it above the fullscreen iframe.
 */
export default function useFullscreenWatermark(
	box: RefObject<HTMLDivElement | null>,
	mark: RefObject<HTMLDivElement | null>,
	active: boolean
) {
	useEffect(() => {
		if (!active) return;
		const onChange = () => {
			const b = box.current;
			const m = mark.current;
			if (!b || !m) return;
			const current = document.fullscreenElement;
			if (current && current !== b && b.contains(current)) {
				m.setAttribute("popover", "manual");
				if (!m.matches(":popover-open")) m.showPopover();
			} else if (m.hasAttribute("popover")) {
				m.hidePopover();
				m.removeAttribute("popover");
			}
		};
		// The browser closes popovers on every fullscreen request.
		const m = mark.current;
		m?.addEventListener("toggle", onChange);
		document.addEventListener("fullscreenchange", onChange);
		return () => {
			m?.removeEventListener("toggle", onChange);
			document.removeEventListener("fullscreenchange", onChange);
		};
	}, [box, mark, active]);
}
