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
		glow: `0 0 60px ${alpha(accent, 0.15)}`,
		glowStrong: `0 0 80px ${alpha(accent, 0.28)}`,
		cardShadow: isDark
			? "0 8px 32px rgba(0,0,0,0.45)"
			: "0 8px 32px rgba(16,24,40,0.08)",
		cardShadowHover: isDark
			? `0 16px 48px ${alpha(accent, 0.14)}, 0 8px 24px rgba(0,0,0,0.35)`
			: "0 16px 48px rgba(16,24,40,0.1), 0 8px 24px rgba(16,24,40,0.05)",
	};
}
