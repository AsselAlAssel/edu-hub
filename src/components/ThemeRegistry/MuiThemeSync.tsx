"use client";

import type { Direction } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";
import { useMemo } from "react";
import { createEduTheme } from "../../../theme";
import type { EduColorMode } from "../../../theme/palettes";

function resolveColorMode(resolvedTheme: string | undefined): EduColorMode {
	return resolvedTheme === "dark" ? "dark" : "light";
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
	const { resolvedTheme } = useNextTheme();
	const colorMode = resolveColorMode(resolvedTheme);
	const muiTheme = useMemo(
		() => createEduTheme(direction, colorMode),
		[direction, colorMode],
	);

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	);
}
