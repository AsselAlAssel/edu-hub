"use client";
import { Direction, createTheme } from "@mui/material";
import { Tajawal } from "next/font/google";

const font = Tajawal({
	weight: ["200", "300", "400", "500", "700", "800", "900"],
	subsets: ["arabic"],
});

export const createEduTheme = (direction: Direction) => {
	const theme = createTheme({
		direction,
		palette: {
			primary: {
				main: "#0088DD",
				dark: "#005991",
				contrastText: "#FFFFFF",
			},
			success: {
				main: "#079455",
			},
			background: {
				brand: "#0071B8",
				["brand-secondary"]: "#99D8FF",
				default: "#FAFBFC",
				paper: "#FFFFFF",
			},
			text: {
				primary: "#101828",
				secondary: "#005991",
				secondaryLight: "#0088DD",
				tertiary: "#475467",
				placeholder: "#667085",
				["brand-tertiary"]: "#0071B8",
				["brand-secondary"]: "#005991",
			},
			border: {
				main: "#D0D5DD",
				secondary: "#EAECF0",
			},
		},
		shape: {
			borderRadius: 8,
		},
		typography: {
			fontFamily: font.style.fontFamily,
			h1: {
				fontSize: "3rem",
				fontWeight: 800,
				lineHeight: 1.2,
				letterSpacing: "-0.02em",
			},
			h2: {
				fontSize: "2.25rem",
				fontWeight: 700,
				lineHeight: 1.25,
				letterSpacing: "-0.01em",
			},
			h3: {
				fontSize: "1.75rem",
				fontWeight: 700,
				lineHeight: 1.3,
			},
			h4: {
				fontSize: "1.5rem",
				fontWeight: 700,
				lineHeight: 1.35,
			},
			h5: {
				fontSize: "1.25rem",
				fontWeight: 600,
				lineHeight: 1.4,
			},
			h6: {
				fontSize: "1rem",
				fontWeight: 600,
				lineHeight: 1.5,
			},
			body1: {
				fontSize: "1rem",
				lineHeight: 1.6,
			},
			body2: {
				fontSize: "0.875rem",
				lineHeight: 1.5,
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					"*:focus-visible": {
						outline: "2px solid #0088DD",
						outlineOffset: "2px",
						borderRadius: "4px",
					},
				},
			},
			MuiButton: {
				defaultProps: { variant: "contained", disableRipple: true },
				styleOverrides: {
					root: ({ theme }) => ({
						textTransform: "none",
						boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
						borderRadius: 8,
						fontWeight: 600,
						fontSize: 16,
						border: "1px solid",
						borderColor: "#0088DD",
						flexShrink: 0,
						padding: "12px 20px",
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						transition:
							"background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
						[theme.breakpoints.down("sm")]: {
							padding: "12px 16px",
							fontSize: 14,
						},
						"&:hover": {
							backgroundColor: `${theme.palette.primary.dark} !important`,
							boxShadow:
								"0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
						},
						"&:active": {
							transform: "scale(0.98)",
						},
						"&:focus-visible": {
							outline: `2px solid ${theme.palette.primary.main}`,
							outlineOffset: "2px",
						},
					}),
					sizeLarge: {
						height: 60,
					},
					sizeMedium: {
						height: 48,
					},
					sizeSmall: {
						height: 40,
					},
				},
				variants: [
					{
						props: { disabled: true },
						style: {
							color: "#98A2B3",
							borderColor: "#EAECF0 !important",
							backgroundColor: "#F2F4F7",
						},
					},
					{
						props: { variant: "text" },
						style: {
							border: "none",
							boxShadow: "none",
							"&:hover": {
								backgroundColor: "transparent",
								boxShadow: "none",
							},
						},
					},
					{
						props: { color: "secondary" },
						style: {
							backgroundColor: "#fff",
							color: "#344054",
							borderColor: "#D0D5DD",
							"&:hover": {
								backgroundColor: "#F2F4F7",
								boxShadow: "none",
							},
						},
					},
					{
						props: { variant: "outlined", color: "secondary" },
						style: {
							"&:hover": {
								borderColor: "#0088DD",
							},
						},
					},
					{
						props: { variant: "outlined", color: "error" },
						style: {
							backgroundColor: "#fff",
							color: "#B42318",
							borderColor: "#FDA29B",
							"&:hover": {
								backgroundColor: "#FDE8E4",
								boxShadow: "none",
							},
						},
					},
					{
						props: { variant: "outlined", color: "primary" },
						style: ({ theme }) => ({
							backgroundColor: "#fff",
							color: theme.palette.text.secondary,
							borderColor: theme.palette.primary.main,
							"&:hover": {
								backgroundColor: "#E6F0FF",
								boxShadow: "none",
							},
						}),
					},
				],
			},
			MuiTypography: {
				styleOverrides: {
					root: ({ theme }) => ({
						fontFamily: font.style.fontFamily,
						color: theme.palette.text.primary,
						letterSpacing: direction === "rtl" ? ".1px" : undefined,
					}),
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						borderRadius: 10,
						"& .MuiInputBase-root": {
							backgroundColor: "white",
							transition: "border-color 0.2s ease, box-shadow 0.2s ease",
							"& fieldset": {
								borderColor: "#D0D5DD",
								transition: "border-color 0.2s ease",
							},
							"&:hover fieldset": {
								borderColor: "#98A2B3",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#0088DD",
								boxShadow: "0px 0px 0px 4px rgba(0, 136, 221, 0.12)",
							},
						},
					},
				},

				variants: [
					{
						props: { error: true },
						style: {
							"& .MuiInputBase-root": {
								"& fieldset": {
									borderColor: "#FDA29B !important",
								},
								"&.Mui-focused fieldset": {
									boxShadow: "0px 0px 0px 4px rgba(253, 162, 155, 0.2)",
								},
							},
						},
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
					root: {
						color: "#475467",
						fontSize: 14,
						lineHeight: "20px",
						padding: "15px 24px",
					},
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
					root: {
						borderRadius: 12,
						border: "1px solid #EAECF0",
						boxShadow:
							"0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
						transition:
							"box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
						"&:hover": {
							boxShadow:
								"0px 4px 12px rgba(16, 24, 40, 0.08), 0px 2px 6px rgba(16, 24, 40, 0.04)",
							borderColor: "#D0D5DD",
						},
					},
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
					},
					sizeMedium: {
						height: 28,
					},
				},

				variants: [
					{
						props: { color: "primary" },
						style: ({ theme }) => ({
							color: theme.palette.text.secondary,
							borderColor: "#73CAFF",
							backgroundColor: "#BFE6FF",
						}),
					},
					{
						props: { color: "secondary" },
						style: {
							color: "#5925DC",
							borderColor: "#D9D6FE",
							backgroundColor: "#F4F3FF",
						},
					},
					{
						props: { color: "error" },
						style: {
							color: "#C11574",
							backgroundColor: "#FDF2FA",
							borderColor: "#FCCEEE",
						},
					},
					{
						props: { color: "warning" },
						style: {
							color: "#B93815",
							backgroundColor: "#FEF6EE",
							borderColor: "#F9DBAF",
						},
					},
					{
						props: { color: "info" },
						style: {
							color: "#363F72",
							borderColor: "#D5D9EB",
							backgroundColor: "#F8F9FC",
						},
					},
					{
						props: { color: "success" },
						style: {
							backgroundColor: "#ECFDF3",
							color: "#067647",
							border: "1px solid",
							borderColor: "#ABEFC6",
							fontWeight: "500 !important",
							"& .MuiChip-avatar": {
								color: "#17B26A",
							},
						},
					},
				],
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						backgroundColor: "#EAECF0",
					},
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
					paper: {
						padding: "5px",
						paddingTop: "5px",
						border: "1px solid #EAECF0",
						borderRadius: "12px !important",
						boxShadow:
							"0px 12px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 16px -4px rgba(16, 24, 40, 0.03) !important",
					},
					list: {
						padding: "0px",
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						borderRadius: "8px",
						transition: "background-color 0.15s ease",
					},
					selected: {},
				},
			},
			MuiListItemText: {
				styleOverrides: {
					root: {
						"& .MuiTypography-root": {
							color: "#344054 !important",
							fontWeight: "500 !important",
							fontSize: "14px !important",
						},
					},
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
						style: {
							color: "#344054",
						},
					},
					{
						props: { color: "warning" },
						style: {
							color: "#F79009",
						},
					},
					{
						props: { color: "error" },
						style: {
							color: "#D92D20",
						},
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
						borderRadius: 16,
						boxShadow: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
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
					root: {
						textTransform: "none",
						fontWeight: 600,
						fontSize: "0.9375rem",
						transition: "color 0.2s ease",
					},
				},
			},
		},
	});
	return theme;
};
