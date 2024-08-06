"use client";
import { Direction, createTheme } from "@mui/material";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

const font = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	subsets: ["cyrillic"],
});
const notoSansFont = IBM_Plex_Sans_Arabic({
	weight: ["100", "200", "300", "400", "500", "600", "700"],
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
			fontFamily:
				direction === "rtl"
					? notoSansFont.style.fontFamily
					: font.style.fontFamily,
		},
		components: {
			MuiButton: {
				defaultProps: { variant: "contained", disableRipple: true },
				styleOverrides: {
					root: ({ theme }) => ({
						textTransform: "none",
						boxShadow: "0px 1px 2px 0px #1018280D",
						borderRadius: 8,
						fontWeight: 600,
						fontSize: 16,
						border: "1px solid",
						borderColor: "#0088DD",
						flexShrink: 0,
						padding: "12px 20px",
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						[theme.breakpoints.down("sm")]: {
							padding: "12px 16px",
							fontSize: 14,
						},
						"&:hover": {
							backgroundColor: `${theme.palette.primary.dark} !important`,
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
						fontFamily:
							direction === "rtl"
								? notoSansFont.style.fontFamily
								: font.style.fontFamily,
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
							"& fieldset": {
								borderColor: "#D0D5DD",
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
					},
					list: {
						padding: "0px",
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						borderRadius: "5px",
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
		},
	});
	return theme;
};
