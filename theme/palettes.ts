import type { PaletteOptions } from "@mui/material/styles";
import { colors, type ColorMode } from "./tokens";

export type EduColorMode = ColorMode;

/**
 * MUI palette from the Neon Physics tokens.
 * `primary.main` is the blue token: #38BDF8 on the dark background, #0369A1
 * on white (5.9:1, WCAG AA for button/link text).
 */
export function getEduPalette(mode: EduColorMode): PaletteOptions {
	const c = colors[mode];
	const isDark = mode === "dark";

	const primary = {
		contrastText: c.onPrimary,
		light: c.cyan,
		main: c.azure,
		dark: c.primaryDark,
	};

	return {
		mode,
		primary,
		secondary: {
			main: c.violet,
			light: isDark ? "#A78BFA" : "#8B5CF6",
			dark: isDark ? "#7C3AED" : "#5B21B6",
			contrastText: "#FFFFFF",
		},
		success: {
			main: c.success,
			light: isDark ? "#6EE7B7" : "#D1FAE5",
			dark: isDark ? "#10B981" : "#047857",
			contrastText: isDark ? "#022C22" : "#FFFFFF",
		},
		warning: {
			main: c.warning,
			light: isDark ? "#FDE68A" : "#FEF3C7",
			dark: isDark ? "#D97706" : "#92400E",
			contrastText: isDark ? "#1A0F02" : "#FFFFFF",
		},
		error: {
			main: c.error,
			light: isDark ? "#FDA4AF" : "#FFE4E6",
			dark: isDark ? "#F43F5E" : "#BE123C",
			contrastText: isDark ? "#1F0A10" : "#FFFFFF",
		},
		info: {
			main: c.cyan,
			light: isDark ? "#67E8F9" : "#CFFAFE",
			dark: isDark ? "#06B6D4" : "#0E7490",
			contrastText: isDark ? "#04121F" : "#FFFFFF",
		},
		divider: c.border,
		background: {
			default: c.bg,
			paper: c.surface,
			brand: c.primaryDark,
			"brand-secondary": c.surfaceElevated,
			"brand-section": c.surfaceSecondary,
		},
		surface: {
			main: c.surface,
			secondary: c.surfaceSecondary,
			elevated: c.surfaceElevated,
		},
		text: {
			primary: c.textPrimary,
			secondary: c.textSecondary,
			secondaryLight: c.azure,
			tertiary: c.textMuted,
			placeholder: c.textMuted,
			disabled: isDark
				? "rgba(148, 163, 184, 0.5)"
				: "rgba(100, 116, 139, 0.6)",
			"brand-tertiary": c.primaryDark,
			"brand-secondary": c.cyan,
		},
		border: {
			main: c.border,
			secondary: c.border,
			strong: c.borderStrong,
		},
		tertiary: {
			main: c.cyan,
			contrastText: c.onPrimary,
		},
		action: {
			hover: isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(11, 22, 40, 0.04)",
			selected: isDark ? "rgba(56, 189, 248, 0.14)" : "rgba(3, 105, 161, 0.08)",
			focus: isDark ? "rgba(56, 189, 248, 0.24)" : "rgba(3, 105, 161, 0.16)",
		},
	};
}
