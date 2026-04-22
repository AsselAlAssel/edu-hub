import { alpha, type Theme } from "@mui/material/styles";

/**
 * Landing-page visuals derived from the active MUI palette so hero sections
 * follow light/dark mode without hardcoded marketing hex values.
 */
export function landingChrome(theme: Theme) {
	const accent = theme.palette.primary.main;
	const purple = theme.palette.secondary.main;
	const isDark = theme.palette.mode === "dark";

	return {
		bg: theme.palette.background.default,
		surface: theme.palette.background.paper,
		surfaceLight: isDark
			? alpha(theme.palette.background.paper, 0.92)
			: theme.palette.grey[50],
		border: alpha(accent, isDark ? 0.22 : 0.14),
		borderHover: alpha(accent, isDark ? 0.42 : 0.32),
		accent,
		purple,
		text: theme.palette.text.primary,
		textSecondary: theme.palette.text.tertiary,
		glow: isDark
			? `0 0 40px ${alpha(accent, 0.1)}`
			: `0 0 28px ${alpha(accent, 0.045)}`,
		glowStrong: isDark
			? `0 0 56px ${alpha(accent, 0.18)}`
			: `0 0 36px ${alpha(accent, 0.07)}`,
		cardShadow: isDark
			? "0 6px 22px rgba(0,0,0,0.28)"
			: "0 2px 8px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.02)",
		cardShadowHover: isDark
			? `0 10px 32px ${alpha(accent, 0.09)}, 0 5px 18px rgba(0,0,0,0.22)`
			: `0 6px 16px ${alpha(accent, 0.06)}, 0 2px 8px rgba(15,23,42,0.035)`,
	};
}
