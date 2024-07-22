"use client";
import { alpha, colors, createTheme } from "@mui/material";
import { IBM_Plex_Sans } from "next/font/google";

const font = IBM_Plex_Sans({
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	subsets: ["cyrillic"],
});

const theme = createTheme({
	palette: {
		primary: {
			main: "#CDF463",
			dark: "#A4C34F",
			light: "#D7F683",
		},
		error: {
			main: "#FF0000",
			light: "#FFCDD2",
		},
		text: {
			primary: "#121713",
			secondary: "#667085",
			placeholder: "#667085",
		},
	},
	shape: {
		borderRadius: 8,
	},
	typography: {
		fontFamily: font.style.fontFamily,
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
			},
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.text.primary,
					fontSize: theme.typography.pxToRem(16),
					padding: theme.spacing(1.5, 2),
					border: "1px solid",
					fontWeight: 500,
					borderColor: theme.palette.primary.main,
					borderRadius: theme.shape.borderRadius,
					textTransform: "none",
					boxShadow: "none",
					"&:hover": {
						backgroundColor: theme.palette.primary.light,
						borderColor: theme.palette.primary.light,
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					},
				}),
				sizeSmall: ({ theme }) => ({
					// padding: theme.spacing(1, 1.5),
					fontSize: theme.typography.pxToRem(14),
					height: "40px",
				}),
			},
			variants: [
				{
					props: { variant: "outlined" },
					style: ({ theme }) => ({
						backgroundColor: "transparent",
						"&:hover": {
							backgroundColor: theme.palette.primary.light,
						},
					}),
				},
			],
		},

		MuiListItemIcon: {
			styleOverrides: {
				root: {
					color: "black",
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				InputLabelProps: { shrink: true },
			},
			styleOverrides: {
				root: ({ theme }) => ({
					"& .MuiInputBase-root": {
						backgroundColor: "white",
						"& fieldset": {
							borderColor: "#E0E0E0",
						},
						"&:focus-within fieldset": {
							borderColor: theme.palette.primary.dark,
							boxShadow: "0px 0px 0px 4px #F0F7F4",
						},
						"& .MuiInputBase-input": {
							lineHeight: "1.5rem",
						},
					},
				}),
			},
			variants: [
				{
					props: { disabled: true },
					style: {
						"& .MuiInputBase-root": {
							backgroundColor: "#F9FAFB",
							color: "#667085",
						},
					},
				},
			],
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					boxShadow: "0px 8px 8px - 4px #10182808",
				},
			},
		},
		MuiDialogContent: {
			styleOverrides: {
				root: {
					padding: "24px",
				},
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(3),
					justifyContent: "space-between",
					borderTop: "1px solid",
					borderColor: colors.grey[200],
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
					fontWeight: 500,
					color: "#474E5D",
					transform: "none",
				}),
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: ({ theme }) => ({
					color: theme.palette.text.primary,
					paddingLeft: theme.spacing(3),
					paddingRight: theme.spacing(3),
				}),
			},
			variants: [
				{
					props: { variant: "head" },
					style: ({ theme }) => ({
						fontWeight: 500,
						fontSize: theme.typography.pxToRem(16),
					}),
				},
			],
		},
		MuiTabs: {
			defaultProps: {
				TabIndicatorProps: {
					sx: {
						display: "none",
					},
				},
			},
			styleOverrides: {
				root: () => ({
					borderRadius: 8,
					overflow: "hidden",
					height: "40px !important",
					minHeight: 0,
					padding: 0,
					lineHeight: 1,
					boxSizing: "border-box",
				}),
			},
		},
		MuiTab: {
			defaultProps: {
				disableRipple: true,
				disableFocusRipple: true,
				disableTouchRipple: true,
			},
			styleOverrides: {
				root: ({ theme }) => {
					return {
						color: theme.palette.text.secondary,
						height: "40px !important",
						minHeight: "unset",
						textTransform: "none",
						lineHeight: 1,
						backgroundColor: alpha(theme.palette.text.primary, 0.04),

						"&.Mui-selected": {
							backgroundColor: theme.palette.primary.main,
							color: theme.palette.text.primary,
							borderRadius: 0,
							height: "40px !important",
							lineHeight: 1,
						},
					};
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: ({ theme }) => ({
					height: 8,
					borderRadius: 4,
					backgroundColor: alpha(theme.palette.text.primary, 0.5),
				}),
				bar: ({ theme }) => ({
					borderRadius: 4,
					backgroundColor: theme.palette.primary.main,
				}),
			},
		},
	},
});
export default theme;
