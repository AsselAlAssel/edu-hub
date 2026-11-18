"use client";
import { useCallback, useEffect, useState, type RefObject } from "react";

type WebkitElement = HTMLElement & {
	webkitRequestFullscreen?: () => Promise<void> | void;
};
type WebkitDocument = Document & { webkitFullscreenEnabled?: boolean };
type LockableOrientation = ScreenOrientation & {
	lock?: (orientation: "landscape") => Promise<void>;
};

/**
 * Fullscreen for a player box. Uses the Fullscreen API where an element can go
 * fullscreen (desktop, Android, iPad); iPhone Safari only allows it on <video>,
 * so there the box is pinned over the viewport instead (`pseudo`).
 */
export default function useFullscreen(ref: RefObject<HTMLElement | null>) {
	const [pseudo, setPseudo] = useState(false);

	useEffect(() => {
		if (!pseudo) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			// Leave fullscreen only; the dialog stays open.
			event.stopPropagation();
			setPseudo(false);
		};
		document.addEventListener("keydown", onKey, true);
		return () => document.removeEventListener("keydown", onKey, true);
	}, [pseudo]);

	const enter = useCallback(async () => {
		const el = ref.current as WebkitElement | null;
		if (!el) return;
		const doc = document as WebkitDocument;
		const enabled = doc.fullscreenEnabled || doc.webkitFullscreenEnabled;
		const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
		if (!enabled || !request) return setPseudo(true);
		try {
			await request.call(el);
			await (screen.orientation as LockableOrientation | undefined)
				?.lock?.("landscape")
				.catch(() => undefined);
		} catch {
			setPseudo(true);
		}
	}, [ref]);

	const exit = useCallback(() => setPseudo(false), []);

	return { pseudo, enter, exit };
}
