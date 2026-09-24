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
			radii,
			layout,
		},
		// Arabic script is joined: negative letter-spacing breaks glyph joins.
		typography: {
			fontFamily: appFontStack,
			h1: { fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.25 },
			h2: { fontSize: "2.125rem", fontWeight: 800, lineHeight: 1.3 },
			h3: { fontSize: "1.625rem", fontWeight: 700, lineHeight: 1.35 },
			h4: { fontSize: "1.375rem", fontWeight: 700, lineHeight: 1.4 },
			h5: { fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.5 },
			h6: { fontSize: "1rem", fontWeight: 700, lineHeight: 1.55 },
			subtitle1: { fontSize: "1.0625rem", lineHeight: 1.75, fontWeight: 500 },
			subtitle2: { fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 700 },
			body1: { fontSize: "1rem", lineHeight: 1.8 },
			body2: { fontSize: "0.9375rem", lineHeight: 1.7 },
			button: { fontWeight: 700, textTransform: "none" },
			caption: { fontSize: "0.8125rem", lineHeight: 1.6, fontWeight: 500 },
			overline: {
				fontSize: "0.8125rem",
				lineHeight: 1.6,
				fontWeight: 700,
				letterSpacing: 0,
				textTransform: "none",
			},
		},
	});

	const focusRing = `0 0 0 3px ${alpha(base.palette.primary.main, isDark ? 0.35 : 0.25)}`;

	const theme = createTheme(base, {
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: c.bg,
						color: c.textPrimary,
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
						fontWeight: 700,
						fontSize: "0.9375rem",
						minHeight: 44,
						paddingInline: 20,
						gap: 4,
						transition: base.transitions.create(
							["background-color", "border-color", "color", "box-shadow"],
							{ duration: motion.duration.fast }
						),
						"&.Mui-focusVisible": { boxShadow: focusRing },
					},
					sizeSmall: { minHeight: 36, paddingInline: 14, fontSize: "0.875rem" },
					sizeLarge: { minHeight: 52, paddingInline: 28, fontSize: "1rem" },
					containedPrimary: {
						"&:hover": { backgroundColor: base.palette.primary.dark },
					},
					outlined: {
						backgroundColor: c.surface,
						borderColor: c.border,
						color: c.textPrimary,
						"&:hover": {
							backgroundColor: c.surfaceSecondary,
							borderColor: c.borderStrong,
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
						fontSize: "0.875rem",
						fontWeight: 700,
						color: c.textPrimary,
						"&.Mui-focused": { color: c.textPrimary },
						"&.Mui-error": { color: base.palette.error.main },
					},
					asterisk: { color: base.palette.error.main },
				},
			},
			MuiFormHelperText: {
				styleOverrides: {
					root: { marginInline: 2, marginTop: 6, fontSize: "0.8125rem" },
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
				styleOverrides: {
					paper: {
						borderRadius: radii.xl,
						border: `1px solid ${c.border}`,
						backgroundColor: c.surface,
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
							backgroundColor: alpha(colors.dark.bg, isDark ? 0.72 : 0.45),
							backdropFilter: "blur(4px)",
						},
					},
				},
			},
			MuiDialogTitle: {
				styleOverrides: {
					root: {
						padding: "24px 24px 8px",
						fontSize: "1.125rem",
						fontWeight: 800,
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
					root: { minHeight: 44 },
					indicator: { height: 3, borderRadius: 3 },
				},
			},
			MuiTab: {
				styleOverrides: {
					root: {
						minHeight: 44,
						fontWeight: 700,
						fontSize: "0.9375rem",
						color: c.textMuted,
						"&.Mui-selected": { color: base.palette.primary.main },
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: { fontWeight: 700, borderRadius: radii.full },
					outlined: { borderColor: c.border },
				},
			},
			MuiSkeleton: {
				defaultProps: { animation: "wave" },
				styleOverrides: {
					root: { backgroundColor: c.surfaceSecondary },
					rounded: { borderRadius: radii.md },
				},
			},
			MuiAvatar: {
				styleOverrides: {
					root: {
						backgroundColor: base.palette.primary.main,
						color: base.palette.primary.contrastText,
						fontWeight: 800,
					},
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
