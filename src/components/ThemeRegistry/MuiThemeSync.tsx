"use client";

import type { Direction } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useMemo, useSyncExternalStore } from "react";
import { createEduTheme } from "../../../theme";
import type { EduColorMode } from "../../../theme/palettes";

/**
 * The `<html>` class set by next-themes is the single source of truth: the
 * CSS variables (body, gradients) already follow it, so MUI must too. Reading
 * it through a MutationObserver keeps MUI in sync whatever changed it — the
 * toggle, another tab (storage sync) or anything else — so the two can never
 * drift apart (half-light / half-dark pages).
 */
const subscribe = (onChange: () => void) => {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	return () => observer.disconnect();
};

const readMode = (): EduColorMode =>
	document.documentElement.classList.contains("light") ? "light" : "dark";

// The server renders the default (dark) theme; during hydration React uses this
// snapshot, so the first client render matches the server HTML exactly (React
// does not patch mismatched classNames), then switches to the real mode.
const serverMode = (): EduColorMode => "dark";

/** Bridges the page's colour mode to MUI's `createTheme`. */
export default function MuiThemeSync({
	direction,
	children,
}: {
	direction: Direction;
	children: React.ReactNode;
}) {
	const colorMode = useSyncExternalStore(subscribe, readMode, serverMode);
	const muiTheme = useMemo(
		() => createEduTheme(direction, colorMode),
		[direction, colorMode]
	);

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	);
}
