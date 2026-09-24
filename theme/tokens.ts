/**
 * Neon Physics — design tokens.
 * Single source of truth: the MUI palette (theme/palettes.ts) and the CSS
 * custom properties (`cssVariables()`, injected in the root layout) both read
 * these values. Components use theme tokens / CSS vars, never raw hex.
 */
export type ColorMode = "light" | "dark";

export const colors = {
	dark: {
		bg: "#050816",
		surface: "#0A1024",
		surfaceSecondary: "#111B38",
		surfaceElevated: "#17244A",
		border: "rgba(148, 163, 184, 0.18)",
		borderStrong: "rgba(34, 211, 238, 0.45)",
		textPrimary: "#F8FAFC",
		textSecondary: "#CBD5E1",
		textMuted: "#94A3B8",
		cyan: "#22D3EE",
		azure: "#38BDF8",
		primaryDark: "#0284C7",
		violet: "#8B5CF6",
		amber: "#F59E0B",
		success: "#34D399",
		warning: "#F59E0B",
		error: "#FB7185",
		onPrimary: "#03101C",
	},
	// Light: cool blue-grey page, brighter surfaces lifted by clear borders and
	// soft blue shadows; vivid blue as the primary (white text passes AA).
	light: {
		bg: "#EBF2F8",
		surface: "#F7FAFD",
		surfaceSecondary: "#E2EDF6",
		surfaceElevated: "#FFFFFF",
		border: "#AEC3D3",
		borderStrong: "#5EA8C4",
		textPrimary: "#09111B",
		textSecondary: "#334559",
		textMuted: "#4F6275",
		cyan: "#0E7490",
		azure: "#2563EB",
		primaryDark: "#1D4ED8",
		violet: "#6D28D9",
		amber: "#B45309",
		success: "#047857",
		warning: "#B45309",
		error: "#BE123C",
		onPrimary: "#FFFFFF",
	},
} as const satisfies Record<ColorMode, Record<string, string>>;

export type ColorTokens = (typeof colors)[ColorMode];

/** Controlled gradients: hero highlights, primary CTAs and selected states only. */
export const gradients = {
	dark: {
		primary: `linear-gradient(110deg, ${colors.dark.cyan} 0%, ${colors.dark.azure} 55%, ${colors.dark.primaryDark} 100%)`,
		text: `linear-gradient(100deg, ${colors.dark.cyan} 0%, ${colors.dark.azure} 55%, ${colors.dark.violet} 100%)`,
		accent: `linear-gradient(110deg, ${colors.dark.azure}, ${colors.dark.violet})`,
		energy: `linear-gradient(110deg, ${colors.dark.violet}, ${colors.dark.amber})`,
	},
	light: {
		primary: `linear-gradient(110deg, ${colors.light.cyan} 0%, ${colors.light.azure} 65%, ${colors.light.primaryDark} 100%)`,
		text: `linear-gradient(100deg, ${colors.light.cyan} 0%, ${colors.light.azure} 55%, ${colors.light.violet} 100%)`,
		accent: `linear-gradient(110deg, ${colors.light.azure}, ${colors.light.violet})`,
		energy: `linear-gradient(110deg, ${colors.light.violet}, ${colors.light.amber})`,
	},
} as const;

export const radii = {
	sm: 8,
	md: 12,
	lg: 18,
	xl: 26,
	full: 9999,
} as const;

/** Cards → subtle, raised cards → medium, dialogs → strong, CTAs/active → glow. */
export const shadows = {
	light: {
		subtle:
			"0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 8px 24px rgba(9, 17, 27, 0.07)",
		medium:
			"0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 18px 44px rgba(9, 17, 27, 0.12)",
		strong:
			"0 24px 80px rgba(9, 17, 27, 0.18), 0 8px 24px rgba(9, 17, 27, 0.08)",
		glow: "0 0 0 1px rgba(14, 116, 144, 0.22), 0 14px 44px rgba(37, 99, 235, 0.2)",
	},
	dark: {
		subtle:
			"0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 10px 30px rgba(0, 0, 0, 0.35)",
		medium:
			"0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 20px 50px rgba(0, 0, 0, 0.5)",
		strong: "0 30px 90px rgba(0, 0, 0, 0.65), 0 10px 30px rgba(0, 0, 0, 0.4)",
		glow: "0 0 0 1px rgba(34, 211, 238, 0.25), 0 12px 40px rgba(34, 211, 238, 0.28)",
	},
} as const;

/** Motion scale shared by MUI transitions, CSS and Framer Motion. */
export const motion = {
	duration: { fast: 160, base: 240, slow: 420, page: 560 },
	easing: {
		standard: "cubic-bezier(0.2, 0, 0, 1)",
		emphasized: "cubic-bezier(0.22, 1, 0.36, 1)",
	},
	/** Framer Motion equivalents (seconds / bezier arrays). */
	fm: {
		ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
		reveal: 0.6,
		stagger: 0.08,
		spring: { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const,
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
		...Object.entries(gradients[mode]).map(
			([key, value]) => `--qa-gradient-${key}:${value}`
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
		`--qa-ease:${motion.easing.emphasized}`,
	].join(";");

	return `:root{${shared};${declarations("light")}}html.dark{${declarations("dark")}}`;
}
