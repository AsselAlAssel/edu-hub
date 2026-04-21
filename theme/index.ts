import { alpha, Direction, createTheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { appFontStack } from "./fonts";
import { type EduColorMode, getEduPalette } from "./palettes";

export const shadows = {
	xs: "0 1px 2px rgba(16, 24, 40, 0.05)",
	sm: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
	md: "0 4px 12px rgba(16, 24, 40, 0.06), 0 1px 4px rgba(16, 24, 40, 0.04)",
	lg: "0 8px 24px rgba(16, 24, 40, 0.08), 0 4px 8px rgba(16, 24, 40, 0.03)",
	xl: "0 16px 48px rgba(16, 24, 40, 0.1), 0 8px 16px rgba(16, 24, 40, 0.04)",
	focus: "0 0 0 3px rgba(0, 136, 221, 0.12)",
	card: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
	cardHover:
		"0 8px 24px rgba(16, 24, 40, 0.08), 0 4px 8px rgba(16, 24, 40, 0.03)",
} as const;

export const radii = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	full: 9999,
} as const;

export const createEduTheme = (
	direction: Direction,
	colorMode: EduColorMode = "light",
) => {
	const eduTheme = createTheme({
		direction,
		palette: getEduPalette(colorMode),
		shape: {
			borderRadius: radii.md,
		},
		typography: {
			fontFamily: appFontStack,
			h1: {
				fontSize: "2.5rem",
				fontWeight: 700,
				lineHeight: 1.2,
				letterSpacing: "-0.025em",
			},
			h2: {
				fontSize: "2rem",
				fontWeight: 700,
				lineHeight: 1.25,
				letterSpacing: "-0.02em",
			},
			h3: {
				fontSize: "1.5rem",
				fontWeight: 600,
				lineHeight: 1.3,
				letterSpacing: "-0.015em",
			},
			h4: {
				fontSize: "1.25rem",
				fontWeight: 600,
				lineHeight: 1.35,
			},
			h5: {
				fontSize: "1.0625rem",
				fontWeight: 600,
				lineHeight: 1.45,
			},
			h6: {
				fontSize: "0.9375rem",
				fontWeight: 600,
				lineHeight: 1.5,
				letterSpacing: "0.01em",
			},
			body1: {
				fontSize: "1rem",
				lineHeight: 1.625,
				fontWeight: 400,
			},
			body2: {
				fontSize: "0.875rem",
				lineHeight: 1.6,
				fontWeight: 400,
			},
			caption: {
				fontSize: "0.75rem",
				lineHeight: 1.5,
				fontWeight: 500,
				letterSpacing: "0.02em",
			},
			overline: {
				fontSize: "0.6875rem",
				lineHeight: 1.5,
				fontWeight: 600,
				letterSpacing: "0.08em",
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: ({ theme }: { theme: Theme }) => ({
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
						transition:
							"background-color 0.28s ease, color 0.28s ease, border-color 0.28s ease",
					}),
					"*:focus-visible": ({ theme }: { theme: Theme }) => ({
						outline: `2px solid ${theme.palette.primary.main}`,
						outlineOffset: "2px",
						borderRadius: "4px",
					}),
				},
			},
			MuiButton: {
				defaultProps: { variant: "contained", disableRipple: true },
				styleOverrides: {
					root: ({ theme }) => ({
						textTransform: "none",
						boxShadow: shadows.xs,
						borderRadius: radii.md,
						fontWeight: 600,
						fontSize: 16,
						border: "1px solid",
						borderColor: theme.palette.primary.main,
						flexShrink: 0,
						padding: "12px 20px",
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
						[theme.breakpoints.down("sm")]: {
							padding: "12px 16px",
							fontSize: 14,
						},
						"&:hover": {
							backgroundColor: `${theme.palette.primary.dark} !important`,
							boxShadow: `${shadows.md}, 0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
							transform: "translateY(-1px)",
						},
						"&:active": {
							transform: "scale(0.98) translateY(0)",
						},
						"&:focus-visible": {
							outline: `2px solid ${theme.palette.primary.main}`,
							outlineOffset: "2px",
						},
					}),
					sizeLarge: {
						height: 56,
						borderRadius: radii.lg,
						fontSize: 16,
						padding: "14px 28px",
					},
					sizeMedium: {
						height: 48,
					},
					sizeSmall: {
						height: 40,
						borderRadius: radii.sm,
						fontSize: 14,
					},
				},
				variants: [
					{
						props: { disabled: true },
						style: ({ theme }) => ({
							color: theme.palette.text.disabled,
							borderColor: `${theme.palette.border.secondary} !important`,
							backgroundColor: theme.palette.action.hover,
							transform: "none",
							boxShadow: "none",
						}),
					},
					{
						props: { variant: "text" },
						style: ({ theme }) => ({
							border: "none",
							boxShadow: "none",
							"&:hover": {
								backgroundColor: alpha(theme.palette.primary.main, 0.08),
								boxShadow: "none",
								transform: "none",
							},
						}),
					},
					{
						props: { color: "secondary" },
						style: ({ theme }) => ({
							backgroundColor: theme.palette.background.paper,
							color: theme.palette.secondary.main,
							borderColor: theme.palette.border.main,
							"&:hover": {
								backgroundColor: theme.palette.action.hover,
								borderColor: theme.palette.text.disabled,
								boxShadow: shadows.sm,
							},
						}),
					},
					{
						props: { variant: "outlined", color: "secondary" },
						style: ({ theme }) => ({
							"&:hover": {
								borderColor: theme.palette.primary.main,
							},
						}),
					},
					{
						props: { variant: "outlined", color: "error" },
						style: ({ theme }) => ({
							backgroundColor: theme.palette.background.paper,
							color: theme.palette.error.dark,
							borderColor: alpha(theme.palette.error.main, 0.45),
							"&:hover": {
								backgroundColor: alpha(theme.palette.error.main, 0.08),
								boxShadow: "none",
							},
						}),
					},
					{
						props: { variant: "outlined", color: "primary" },
						style: ({ theme }) => ({
							backgroundColor: theme.palette.background.paper,
							color: theme.palette.text.secondary,
							borderColor: theme.palette.primary.main,
							"&:hover": {
								backgroundColor: alpha(theme.palette.primary.main, 0.12),
								boxShadow: "none",
							},
						}),
					},
				],
			},
			MuiTypography: {
				styleOverrides: {
					root: ({ theme }) => ({
						fontFamily: appFontStack,
						color: theme.palette.text.primary,
						letterSpacing: direction === "rtl" ? "0.01em" : undefined,
					}),
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: radii.md,
						"& .MuiInputBase-root": {
							backgroundColor: theme.palette.background.paper,
							borderRadius: radii.md,
							transition: "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.35s ease",
							"& fieldset": {
								borderColor: theme.palette.border.main,
								transition: "border-color 0.2s ease",
							},
							"&:hover fieldset": {
								borderColor: theme.palette.text.disabled,
							},
							"&.Mui-focused fieldset": {
								borderColor: theme.palette.primary.main,
								boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
							},
						},
					}),
				},
				variants: [
					{
						props: { error: true },
						style: ({ theme }) => ({
							"& .MuiInputBase-root": {
								"& fieldset": {
									borderColor: `${alpha(theme.palette.error.main, 0.55)} !important`,
								},
								"&.Mui-focused fieldset": {
									boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.2)}`,
								},
							},
						}),
					},
				],
			},
			MuiCheckbox: {
				styleOverrides: {
					root: ({ theme }) => ({
						"&.Mui-checked": {
							color: theme.palette.text["brand-secondary"],
						},
					}),
				},
			},
			MuiInputLabel: {
				defaultProps: {
					shrink: true,
				},
				styleOverrides: {
					root: ({ theme }) => ({
						marginBottom: "6px",
						fontSize: theme.typography.pxToRem(14),
						lineHeight: theme.typography.pxToRem(20),
						fontWeight: 600,
						color: theme.palette.text.primary,
						transform: "none",
					}),
				},
			},
			MuiTableCell: {
				styleOverrides: {
					root: ({ theme }) => ({
						color: theme.palette.text.tertiary,
						fontSize: 14,
						lineHeight: "20px",
						padding: "15px 24px",
					}),
				},
				variants: [
					{
						props: { variant: "head" },
						style: ({ theme }) => ({
							color: theme.palette.text.tertiary,
							padding: "13px 24px",
							fontWeight: 500,
						}),
					},
				],
			},
			MuiCard: {
				styleOverrides: {
					root: ({ theme }) => ({
						borderRadius: radii.lg,
						border: `1px solid ${theme.palette.border.secondary}`,
						boxShadow: shadows.card,
						backgroundColor: theme.palette.background.paper,
						transition:
							"all 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.35s ease, border-color 0.35s ease",
						"&:hover": {
							boxShadow: shadows.cardHover,
							borderColor: theme.palette.border.main,
							transform: "translateY(-2px)",
						},
					}),
				},
			},
			MuiChip: {
				defaultProps: {
					variant: "outlined",
					size: "medium",
				},
				styleOverrides: {
					root: {
						fontWeight: 500,
						borderRadius: radii.sm,
					},
					sizeMedium: {
						height: 28,
					},
				},
				variants: [
					{
						props: { color: "primary" },
						style: ({ theme }) => ({
							color:
								theme.palette.mode === "dark"
									? theme.palette.primary.contrastText
									: theme.palette.primary.dark,
							borderColor: alpha(theme.palette.primary.main, 0.4),
							backgroundColor: alpha(theme.palette.primary.main, 0.12),
						}),
					},
					{
						props: { color: "secondary" },
						style: ({ theme }) => ({
							color: theme.palette.text.secondary,
							borderColor: alpha(theme.palette.secondary.main, 0.5),
							backgroundColor: alpha(theme.palette.secondary.main, 0.1),
						}),
					},
					{
						props: { color: "error" },
						style: ({ theme }) => ({
							color: theme.palette.error.dark,
							backgroundColor: alpha(theme.palette.error.main, 0.1),
							borderColor: alpha(theme.palette.error.main, 0.35),
						}),
					},
					{
						props: { color: "warning" },
						style: ({ theme }) => ({
							color: theme.palette.warning.dark,
							backgroundColor: alpha(theme.palette.warning.main, 0.12),
							borderColor: alpha(theme.palette.warning.main, 0.35),
						}),
					},
					{
						props: { color: "info" },
						style: ({ theme }) => ({
							color: theme.palette.info.dark,
							backgroundColor: alpha(theme.palette.info.main, 0.1),
							borderColor: alpha(theme.palette.info.main, 0.35),
						}),
					},
					{
						props: { color: "success" },
						style: ({ theme }) => ({
							backgroundColor: alpha(theme.palette.success.main, 0.12),
							color: theme.palette.success.dark,
							border: "1px solid",
							borderColor: alpha(theme.palette.success.main, 0.4),
							fontWeight: "500 !important",
							"& .MuiChip-avatar": {
								color: theme.palette.success.main,
							},
						}),
					},
				],
			},
			MuiDivider: {
				styleOverrides: {
					root: ({ theme }) => ({
						backgroundColor: theme.palette.divider,
					}),
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					root: ({ theme }) => ({
						height: 8,
						borderRadius: 4,
						backgroundColor: theme.palette.border.secondary,
					}),
					bar: ({ theme }) => ({
						borderRadius: 4,
						backgroundColor: theme.palette.background.brand,
					}),
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: ({ theme }) => ({
						padding: "5px",
						paddingTop: "5px",
						border: `1px solid ${theme.palette.border.secondary}`,
						backgroundColor: theme.palette.background.paper,
						borderRadius: `${radii.lg}px !important`,
						boxShadow: `${shadows.xl} !important`,
					}),
					list: {
						padding: "0px",
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						borderRadius: radii.sm,
						transition: "background-color 0.15s ease",
					},
					selected: {},
				},
			},
			MuiListItemText: {
				styleOverrides: {
					root: ({ theme }) => ({
						"& .MuiTypography-root": {
							color: `${theme.palette.text.primary} !important`,
							fontWeight: "500 !important",
							fontSize: "14px !important",
						},
					}),
				},
			},
			MuiListItemIcon: {
				styleOverrides: {
					root: {
						minWidth: "28px !important",
					},
				},
			},
			MuiCircularProgress: {
				variants: [
					{
						props: { color: "success" },
						style: ({ theme }) => ({
							color: theme.palette.success.main,
						}),
					},
					{
						props: { color: "secondary" },
						style: ({ theme }) => ({
							color: theme.palette.secondary.main,
						}),
					},
					{
						props: { color: "warning" },
						style: ({ theme }) => ({
							color: theme.palette.warning.main,
						}),
					},
					{
						props: { color: "error" },
						style: ({ theme }) => ({
							color: theme.palette.error.main,
						}),
					},
				],
			},
			MuiDialogActions: {
				styleOverrides: {
					root: {
						padding: "16px 24px",
					},
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						borderRadius: radii.xl,
						boxShadow: shadows.xl,
					},
				},
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						borderRadius: 0,
					},
				},
			},
			MuiTabs: {
				styleOverrides: {
					indicator: {
						borderRadius: 2,
						height: 3,
					},
				},
			},
			MuiTab: {
				styleOverrides: {
					root: ({ theme }) => ({
						textTransform: "none",
						fontWeight: 600,
						fontSize: "0.9375rem",
						color: theme.palette.text.tertiary,
						transition: theme.transitions.create("color", { duration: 180 }),
					}),
				},
			},
		},
	});
	return eduTheme;
};
