import Grow from "@mui/material/Grow";
import {
	alpha,
	createTheme,
	responsiveFontSizes,
	type Direction,
} from "@mui/material/styles";
import { appFontStack } from "./fonts";
import { getEduPalette, type EduColorMode } from "./palettes";
import {
	breakpoints,
	colors,
	layout,
	motion,
	radii,
	gradients,
	shadows as shadowTokens,
	zIndex,
} from "./tokens";

export { radii, motion, layout, zIndex };

/** Back-compat alias for older imports of `shadows` from the theme. */
export const shadows = {
	xs: shadowTokens.light.subtle,
	sm: shadowTokens.light.subtle,
	md: shadowTokens.light.medium,
	lg: shadowTokens.light.medium,
	xl: shadowTokens.light.strong,
	focus: `0 0 0 3px ${alpha(colors.light.primaryDark, 0.2)}`,
	card: shadowTokens.light.subtle,
	cardHover: shadowTokens.light.medium,
} as const;

export const createEduTheme = (
	direction: Direction,
	colorMode: EduColorMode = "dark"
) => {
	const c = colors[colorMode];
	const elevation = shadowTokens[colorMode];
	const isDark = colorMode === "dark";

	const base = createTheme({
		direction,
		breakpoints: { values: breakpoints },
		palette: getEduPalette(colorMode),
		shape: { borderRadius: radii.md },
		zIndex: {
			appBar: zIndex.header,
			drawer: zIndex.drawer,
			modal: zIndex.dialog,
			snackbar: zIndex.toast,
			speedDial: zIndex.fab,
		},
		transitions: {
			duration: {
				shortest: motion.duration.fast,
				shorter: motion.duration.fast,
				short: motion.duration.base,
				standard: motion.duration.base,
				complex: motion.duration.slow,
			},
			easing: {
				easeInOut: motion.easing.standard,
				easeOut: motion.easing.emphasized,
				easeIn: motion.easing.standard,
				sharp: motion.easing.standard,
			},
		},
		tokens: {
			colors: c,
			shadows: elevation,
			gradients: gradients[colorMode],
			radii,
			layout,
		},
		// Arabic script is joined: negative letter-spacing breaks glyph joins,
		// and tall ascenders/dots need generous line-height.
		typography: {
			fontFamily: appFontStack,
			fontWeightRegular: 400,
			fontWeightMedium: 500,
			fontWeightBold: 700,
			h1: { fontSize: "3rem", fontWeight: 700, lineHeight: 1.3 },
			h2: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.35 },
			h3: { fontSize: "1.625rem", fontWeight: 700, lineHeight: 1.45 },
			h4: { fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.5 },
			h5: { fontSize: "1.1875rem", fontWeight: 600, lineHeight: 1.6 },
			h6: { fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.65 },
			subtitle1: { fontSize: "1.125rem", lineHeight: 1.9, fontWeight: 400 },
			subtitle2: { fontSize: "0.9375rem", lineHeight: 1.7, fontWeight: 600 },
			body1: { fontSize: "1rem", lineHeight: 1.9 },
			body2: { fontSize: "0.9375rem", lineHeight: 1.8 },
			button: { fontWeight: 600, textTransform: "none", lineHeight: 1.5 },
			caption: { fontSize: "0.8125rem", lineHeight: 1.7, fontWeight: 500 },
			overline: {
				fontSize: "0.875rem",
				lineHeight: 1.6,
				fontWeight: 600,
				letterSpacing: 0,
				textTransform: "none",
			},
		},
	});
	const g = gradients[colorMode];

	const focusRing = `0 0 0 3px ${alpha(base.palette.primary.main, isDark ? 0.35 : 0.25)}`;

	const theme = createTheme(base, {
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					// CSS variables (theme/tokens.ts): correct from the first server
					// paint in either mode, and identical global CSS for both themes.
					body: {
						backgroundColor: "var(--qa-bg)",
						color: "var(--qa-text-primary)",
					},
				},
			},
			MuiPaper: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					// MUI tints dark-mode paper with a white gradient; tokens own surfaces.
					root: { backgroundImage: "none" },
				},
			},
			MuiButtonBase: {
				defaultProps: { disableRipple: true },
			},
			MuiButton: {
				defaultProps: { variant: "contained", disableElevation: true },
				styleOverrides: {
					root: {
						borderRadius: radii.md,
						fontWeight: 600,
						fontSize: "0.9375rem",
						minHeight: 46,
						paddingInline: 22,
						gap: 4,
						transition: base.transitions.create(
							[
								"background-color",
								"border-color",
								"color",
								"box-shadow",
								"transform",
							],
							{ duration: motion.duration.fast }
						),
						"&:active": { transform: "translateY(1px) scale(0.99)" },
						"&.Mui-focusVisible": { boxShadow: focusRing },
					},
					sizeSmall: { minHeight: 38, paddingInline: 14, fontSize: "0.875rem" },
					sizeLarge: {
						minHeight: 54,
						paddingInline: 30,
						fontSize: "1.0625rem",
						borderRadius: radii.lg,
					},
					// Gradient CTA: cyan → blue, glow on hover, lift without layout shift.
					containedPrimary: {
						backgroundImage: g.primary,
						backgroundColor: base.palette.primary.main,
						color: c.onPrimary,
						boxShadow: isDark ? "none" : elevation.subtle,
						"&:hover": {
							backgroundImage: g.primary,
							backgroundColor: base.palette.primary.dark,
							boxShadow: elevation.glow,
							transform: "translateY(-2px)",
						},
						"&.Mui-disabled": { backgroundImage: "none" },
					},
					outlined: {
						backgroundColor: alpha(c.surface, isDark ? 0.6 : 1),
						borderColor: isDark ? alpha(c.cyan, 0.35) : c.borderStrong,
						color: c.textPrimary,
						"&:hover": {
							backgroundColor: isDark
								? alpha(c.cyan, 0.08)
								: c.surfaceSecondary,
							borderColor: base.palette.primary.main,
							transform: "translateY(-2px)",
						},
					},
					outlinedError: {
						color: base.palette.error.main,
						borderColor: alpha(base.palette.error.main, 0.4),
						"&:hover": {
							backgroundColor: alpha(base.palette.error.main, 0.08),
							borderColor: base.palette.error.main,
						},
					},
					text: {
						color: c.textSecondary,
						"&:hover": {
							backgroundColor: base.palette.action.hover,
							color: c.textPrimary,
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						borderRadius: radii.md,
						color: c.textSecondary,
						"&:hover": { backgroundColor: base.palette.action.hover },
						"&.Mui-focusVisible": { boxShadow: focusRing },
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						borderRadius: radii.md,
						backgroundColor: c.surface,
						color: c.textPrimary,
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: c.border,
							transition: base.transitions.create("border-color"),
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: c.borderStrong,
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: base.palette.primary.main,
							borderWidth: 1,
						},
						"&.Mui-focused": { boxShadow: focusRing },
						"&.Mui-error .MuiOutlinedInput-notchedOutline": {
							borderColor: base.palette.error.main,
						},
					},
					input: {
						"&::placeholder": { color: c.textMuted, opacity: 1 },
					},
				},
			},
			MuiInputLabel: {
				defaultProps: { shrink: true },
				styleOverrides: {
					root: {
						position: "static",
						transform: "none",
						marginBottom: 8,
						fontSize: "0.9375rem",
						fontWeight: 500,
						color: c.textPrimary,
						"&.Mui-focused": { color: c.textPrimary },
						"&.Mui-error": { color: base.palette.error.main },
					},
					asterisk: { color: base.palette.error.main },
				},
			},
			MuiFormHelperText: {
				styleOverrides: {
					root: {
						marginInline: 2,
						marginTop: 6,
						fontSize: "0.8125rem",
						// Validation errors fade in place — no layout jump beyond the line itself.
						"&.Mui-error": {
							fontWeight: 500,
							animation: `qaHelperIn ${motion.duration.base}ms ${motion.easing.emphasized} both`,
						},
						"@keyframes qaHelperIn": {
							from: { opacity: 0, transform: "translateY(-3px)" },
							to: { opacity: 1, transform: "none" },
						},
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: radii.lg,
						border: `1px solid ${c.border}`,
						backgroundColor: c.surface,
						boxShadow: elevation.subtle,
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						marginTop: 6,
						minWidth: 180,
						padding: 6,
						borderRadius: radii.md,
						border: `1px solid ${c.border}`,
						backgroundColor: c.surfaceElevated,
						boxShadow: elevation.medium,
					},
					list: { padding: 0 },
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						borderRadius: radii.sm,
						minHeight: 40,
						gap: 10,
						fontSize: "0.9375rem",
						fontWeight: 600,
						"&.Mui-focusVisible": {
							backgroundColor: base.palette.action.selected,
						},
					},
				},
			},
			MuiListItemIcon: {
				styleOverrides: {
					root: { minWidth: "0 !important", color: "inherit" },
				},
			},
			MuiDialog: {
				// Grow = scale + fade from the centre (Menus use it too).
				defaultProps: { TransitionComponent: Grow },
				styleOverrides: {
					paper: {
						borderRadius: radii.xl,
						border: `1px solid ${isDark ? alpha(c.cyan, 0.22) : c.border}`,
						backgroundColor: c.surface,
						// Top-edge light: a thin cyan line fading out, like a lit panel.
						backgroundImage: `linear-gradient(180deg, ${alpha(c.cyan, isDark ? 0.08 : 0.05)} 0%, transparent 120px)`,
						boxShadow: elevation.strong,
						margin: 16,
						width: "calc(100% - 32px)",
					},
				},
			},
			MuiBackdrop: {
				styleOverrides: {
					root: {
						"&:not(.MuiBackdrop-invisible)": {
							backgroundColor: alpha(colors.dark.bg, isDark ? 0.75 : 0.5),
							backdropFilter: "blur(6px)",
						},
					},
				},
			},
			MuiDialogTitle: {
				styleOverrides: {
					root: {
						padding: "24px 24px 8px",
						fontSize: "1.25rem",
						fontWeight: 700,
					},
				},
			},
			MuiDialogContent: {
				styleOverrides: { root: { padding: "8px 24px 16px" } },
			},
			MuiDialogActions: {
				styleOverrides: { root: { padding: "8px 24px 24px", gap: 8 } },
			},
			MuiDrawer: {
				styleOverrides: {
					paper: { backgroundColor: c.surface, borderColor: c.border },
				},
			},
			MuiTooltip: {
				defaultProps: { arrow: true },
				styleOverrides: {
					tooltip: {
						backgroundColor: isDark ? c.surfaceElevated : c.textPrimary,
						color: isDark ? c.textPrimary : c.surface,
						border: isDark ? `1px solid ${c.border}` : "none",
						fontSize: "0.8125rem",
						fontWeight: 600,
						borderRadius: radii.sm,
						padding: "6px 10px",
					},
					arrow: { color: isDark ? c.surfaceElevated : c.textPrimary },
				},
			},
			MuiTabs: {
				styleOverrides: {
					root: { minHeight: 48 },
					indicator: {
						height: 3,
						borderRadius: 3,
						backgroundImage: g.primary,
						boxShadow: isDark ? `0 0 12px ${alpha(c.cyan, 0.6)}` : "none",
					},
				},
			},
			MuiTab: {
				styleOverrides: {
					root: {
						minHeight: 48,
						fontWeight: 500,
						fontSize: "1rem",
						color: c.textMuted,
						transition: base.transitions.create("color"),
						"&:hover": { color: c.textPrimary },
						"&.Mui-selected": {
							color: base.palette.primary.main,
							fontWeight: 600,
						},
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: { fontWeight: 600, borderRadius: radii.full },
					outlined: { borderColor: c.border },
				},
			},
			// Premium shimmer: a cyan-tinted light band sweeping across.
			MuiSkeleton: {
				defaultProps: { animation: "wave" },
				styleOverrides: {
					root: { backgroundColor: c.surfaceSecondary },
					rounded: { borderRadius: radii.md },
					wave: {
						"&::after": {
							background: `linear-gradient(90deg, transparent, ${alpha(c.cyan, isDark ? 0.12 : 0.14)}, transparent)`,
							animationDuration: "1.4s",
						},
					},
				},
			},
			MuiAvatar: {
				styleOverrides: {
					root: {
						backgroundColor: base.palette.primary.main,
						backgroundImage: g.primary,
						color: base.palette.primary.contrastText,
						fontWeight: 700,
					},
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					root: {
						height: 6,
						borderRadius: radii.full,
						backgroundColor: c.surfaceSecondary,
					},
					bar: { borderRadius: radii.full, backgroundImage: g.primary },
				},
			},
			MuiDivider: {
				styleOverrides: { root: { borderColor: c.border } },
			},
			MuiTableCell: {
				styleOverrides: {
					root: { borderColor: c.border, color: c.textSecondary },
					head: { color: c.textMuted, fontWeight: 700 },
				},
			},
			MuiAlert: {
				styleOverrides: { root: { borderRadius: radii.md } },
			},
			MuiFab: {
				styleOverrides: {
					root: {
						boxShadow: elevation.medium,
						"&.Mui-focusVisible": { boxShadow: focusRing },
					},
				},
			},
			MuiSwitch: {
				styleOverrides: { root: { direction: "ltr" } },
			},
		},
	});

	return responsiveFontSizes(theme, { factor: 2.2 });
};
