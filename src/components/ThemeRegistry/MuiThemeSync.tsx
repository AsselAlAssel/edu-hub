"use client";

import type { Direction } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";
import { useLayoutEffect, useMemo, useState } from "react";
import { createEduTheme } from "../../../theme";
import type { EduColorMode } from "../../../theme/palettes";

function resolveColorMode(resolvedTheme: string | undefined): EduColorMode {
	/** يطابق `defaultTheme="dark"` في ThemeRegistry عندما لا يكون الثيم محلّاً بعد (SSR). */
	if (resolvedTheme === "light") return "light";
	return "dark";
}

/** يقرأ نفس الـ class الذي يضبطه `next-themes` على `<html>` (attribute=`class`). */
function readColorModeFromDocument(): EduColorMode | null {
	if (typeof document === "undefined") return null;
	const root = document.documentElement;
	if (root.classList.contains("dark")) return "dark";
	if (root.classList.contains("light")) return "light";
	return null;
}

/**
 * Bridges `next-themes` to MUI: builds `createTheme` from the resolved
 * color scheme so every MUI component reads `theme.palette.*`.
 *
 * @example
 * ```tsx
 * import { Box, Typography } from "@mui/material";
 * <Box sx={{ bgcolor: "background.paper", color: "text.secondary" }} />
 * ```
 */
export default function MuiThemeSync({
	direction,
	children,
}: {
	direction: Direction;
	children: React.ReactNode;
}) {
	const { resolvedTheme, theme: nextThemeName, forcedTheme } = useNextTheme();
	const fromContext = resolveColorMode(
		forcedTheme ?? resolvedTheme ?? nextThemeName
	);

	/**
	 * أحياناً يكون `class` على `<html>` (وسكربت next-themes + متغيرات CSS)
	 * متقدّماً على حالة الـ hook لبضعة إطارات بعد التحميل أو التبويب.
	 * نصحّح MUI ليطابق الـ DOM حتى لا يظهر هيدر بلون ثيم والصفحة بلون آخر.
	 */
	const [domOverride, setDomOverride] = useState<EduColorMode | null>(null);
	useLayoutEffect(() => {
		const fromDom = readColorModeFromDocument();
		if (fromDom === null) {
			setDomOverride(null);
			return;
		}
		setDomOverride(fromDom !== fromContext ? fromDom : null);
	}, [fromContext]);

	const colorMode = domOverride ?? fromContext;
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
