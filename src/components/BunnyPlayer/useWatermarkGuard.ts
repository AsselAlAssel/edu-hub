"use client";
import { useEffect, useState, type RefObject } from "react";

/** Transparent text (opacity or colour alpha) counts as hidden. */
const isVisible = (el: HTMLElement) => {
	const s = getComputedStyle(el);
	const alpha = Number(s.color.match(/rgba?\([^)]*,\s*([\d.]+)\)/)?.[1] ?? 1);
	return (
		s.display !== "none" &&
		s.visibility === "visible" &&
		Number(s.opacity) >= 0.2 &&
		alpha >= 0.2 &&
		el.offsetWidth > 0 &&
		el.offsetHeight > 0
	);
};

/**
 * True once the watermark is removed, emptied, hidden or pushed out of the
 * player box; the caller then stops playback.
 * ponytail: client-side only; someone who disables JS in DevTools can still
 * beat it. It deters screen-recording leaks, it does not stop downloads (DRM does).
 */
export default function useWatermarkGuard(
	box: RefObject<HTMLDivElement | null>,
	mark: RefObject<HTMLDivElement | null>,
	text: string,
	active: boolean
) {
	const [tampered, setTampered] = useState(false);
	useEffect(() => {
		// Each open starts clean: one stop must not block the next video.
		if (!active) return setTampered(false);
		if (!box.current) return;
		const check = () => {
			const b = box.current;
			const m = mark.current;
			// The whole player gone means the dialog closed, not tampering.
			if (!b) return;
			if (!m || !b.contains(m) || m.textContent !== text || !isVisible(m)) {
				setTampered(true);
				return;
			}
			// While the iframe alone is fullscreen, the watermark sits above it.
			const fullscreen = document.fullscreenElement;
			const frame = fullscreen && b.contains(fullscreen) ? fullscreen : b;
			const br = frame.getBoundingClientRect();
			const mr = m.getBoundingClientRect();
			const inside =
				mr.left >= br.left - 1 &&
				mr.right <= br.right + 1 &&
				mr.top >= br.top - 1 &&
				mr.bottom <= br.bottom + 1;
			if (!inside) setTampered(true);
		};
		const observer = new MutationObserver(check);
		observer.observe(box.current, {
			subtree: true,
			childList: true,
			attributes: true,
			characterData: true,
		});
		// Catches CSS injected elsewhere (stylesheets do not trigger the observer).
		const id = setInterval(check, 1000);
		return () => {
			observer.disconnect();
			clearInterval(id);
		};
	}, [box, mark, text, active]);
	return tampered;
}
