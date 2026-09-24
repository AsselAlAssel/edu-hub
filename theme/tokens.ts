/**
 * Quantum Aurora — design tokens.
 * Single source of truth: the MUI palette (theme/palettes.ts) and the CSS
 * custom properties (`cssVariables()`, injected in the root layout) both read
 * these values. Components use theme tokens / CSS vars, never raw hex.
 */
export type ColorMode = "light" | "dark";

export const colors = {
	dark: {
		bg: "#07111F",
		surface: "#0B1B2E",
		surfaceSecondary: "#10263D",
		surfaceElevated: "#14314B",
		border: "rgba(148, 163, 184, 0.16)",
		borderStrong: "rgba(56, 189, 248, 0.32)",
		textPrimary: "#F8FAFC",
		textSecondary: "#CBD5E1",
		textMuted: "#94A3B8",
		cyan: "#22D3EE",
		azure: "#38BDF8",
		primaryDark: "#0284C7",
		violet: "#8B5CF6",
		success: "#34D399",
		warning: "#FBBF24",
		error: "#FB7185",
		onPrimary: "#04121F",
	},
	light: {
		bg: "#F4F8FC",
		surface: "#FFFFFF",
		surfaceSecondary: "#EAF3FA",
		surfaceElevated: "#FFFFFF",
		border: "#D9E5EF",
		borderStrong: "#8EDCF0",
		textPrimary: "#0B1628",
		textSecondary: "#334155",
		textMuted: "#64748B",
		cyan: "#0891B2",
		azure: "#0284C7",
		primaryDark: "#0369A1",
		violet: "#7C3AED",
		success: "#059669",
		warning: "#D97706",
		error: "#E11D48",
		onPrimary: "#FFFFFF",
	},
} as const satisfies Record<ColorMode, Record<string, string>>;

export type ColorTokens = (typeof colors)[ColorMode];

export const radii = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	full: 9999,
} as const;

/** Restrained elevation: cards → subtle, raised cards → medium, dialogs → strong. */
export const shadows = {
	light: {
		subtle:
			"0 1px 2px rgba(11, 22, 40, 0.05), 0 1px 3px rgba(11, 22, 40, 0.04)",
		medium:
			"0 6px 18px rgba(11, 22, 40, 0.08), 0 2px 6px rgba(11, 22, 40, 0.04)",
		strong:
			"0 24px 60px rgba(11, 22, 40, 0.18), 0 8px 20px rgba(11, 22, 40, 0.08)",
	},
	dark: {
		subtle: "0 1px 2px rgba(0, 0, 0, 0.35)",
		medium: "0 10px 28px rgba(0, 0, 0, 0.38), 0 2px 8px rgba(0, 0, 0, 0.24)",
		strong: "0 28px 72px rgba(0, 0, 0, 0.55), 0 8px 24px rgba(0, 0, 0, 0.35)",
	},
} as const;

export const motion = {
	duration: { fast: 150, base: 220, slow: 360 },
	easing: {
		standard: "cubic-bezier(0.2, 0, 0, 1)",
		emphasized: "cubic-bezier(0.22, 1, 0.36, 1)",
	},
} as const;

export const zIndex = {
	header: 1100,
	drawer: 1200,
	fab: 1050,
	dialog: 1300,
	toast: 1500,
} as const;

export const layout = {
	headerHeight: 72,
	contentMaxWidth: 1240,
	gutter: 16,
} as const;

export const breakpoints = {
	xs: 0,
	sm: 600,
	md: 900,
	lg: 1200,
	xl: 1440,
} as const;

const toKebab = (key: string) =>
	key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

const declarations = (mode: ColorMode) =>
	[
		...Object.entries(colors[mode]).map(
			([key, value]) => `--qa-${toKebab(key)}:${value}`
		),
		...Object.entries(shadows[mode]).map(
			([key, value]) => `--qa-shadow-${key}:${value}`
		),
		`color-scheme:${mode}`,
	].join(";");

/** CSS custom properties for both modes; `html.dark` follows next-themes. */
export function cssVariables() {
	const shared = [
		...Object.entries(radii).map(
			([key, value]) => `--qa-radius-${key}:${value}px`
		),
		`--qa-header-height:${layout.headerHeight}px`,
		`--qa-ease:${motion.easing.standard}`,
	].join(";");

	return `:root{${shared};${declarations("light")}}html.dark{${declarations("dark")}}`;
}
