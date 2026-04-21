"use client";

import {
	alpha,
	Box,
	IconButton,
	IconButtonProps,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import type { FC } from "react";

export const SectionContainer = styled(Box)({
	maxWidth: 1200,
	margin: "0 auto",
	width: "100%",
});

export const SectionStack = styled(Stack)(({ theme }) => ({
	paddingTop: 120,
	paddingBottom: 120,
	position: "relative",
	[theme.breakpoints.down("md")]: {
		paddingTop: 80,
		paddingBottom: 80,
	},
	[theme.breakpoints.down("sm")]: {
		paddingTop: 64,
		paddingBottom: 64,
	},
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
	fontSize: "0.8125rem",
	fontWeight: 700,
	letterSpacing: "0.12em",
	textTransform: "uppercase",
	color: theme.palette.primary.main,
	textAlign: "center",
	marginBottom: 12,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(42),
	fontWeight: 800,
	lineHeight: 1.15,
	letterSpacing: "-0.02em",
	color: theme.palette.text.primary,
	textAlign: "center",
	[theme.breakpoints.down("md")]: {
		fontSize: theme.typography.pxToRem(34),
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(26),
	},
}));

export const SectionSubtitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(18),
	lineHeight: 1.7,
	fontWeight: 400,
	color: theme.palette.text.tertiary,
	textAlign: "center",
	maxWidth: 600,
	margin: "0 auto",
	marginTop: 16,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(16),
	},
}));

export const GlassCard = styled(Box)(({ theme }) => ({
	padding: 28,
	borderRadius: 20,
	backgroundColor:
		theme.palette.mode === "dark"
			? alpha(theme.palette.background.paper, 0.55)
			: alpha(theme.palette.background.paper, 0.92),
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.14)}`,
	boxShadow:
		theme.palette.mode === "dark"
			? "0 8px 32px rgba(0,0,0,0.45)"
			: "0 8px 32px rgba(16,24,40,0.08)",
	transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
	"&:hover": {
		borderColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.42 : 0.32),
		boxShadow:
			theme.palette.mode === "dark"
				? `0 16px 48px ${alpha(theme.palette.primary.main, 0.14)}, 0 8px 24px rgba(0,0,0,0.35)`
				: "0 16px 48px rgba(16,24,40,0.1), 0 8px 24px rgba(16,24,40,0.05)",
		transform: "translateY(-4px)",
	},
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(52),
	fontWeight: 800,
	lineHeight: 1.15,
	letterSpacing: "-0.03em",
	color: theme.palette.text.primary,
	[theme.breakpoints.down("md")]: {
		fontSize: theme.typography.pxToRem(40),
		lineHeight: 1.2,
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(32),
		lineHeight: 1.25,
		textAlign: "center",
	},
}));

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(19),
	lineHeight: 1.7,
	color: theme.palette.text.secondary,
	opacity: 0.95,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(16),
		lineHeight: 1.6,
		textAlign: "center",
	},
}));

export const StyledStack = styled(Stack)(({ theme }) => ({
	paddingTop: 120,
	paddingBottom: 120,
	position: "relative",
	[theme.breakpoints.down("sm")]: {
		paddingTop: 72,
		paddingBottom: 80,
	},
}));

export const StyledSectionTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(36),
	fontWeight: 800,
	lineHeight: 1.25,
	textAlign: "center",
	color: theme.palette.text.primary,
	marginBottom: 8,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(24),
		lineHeight: 1.3,
		marginBottom: 4,
	},
}));

export const StyledSectionSubTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(20),
	lineHeight: 1.5,
	fontWeight: 500,
	color: theme.palette.text.secondary,
	textAlign: "center",
	maxWidth: 700,
	opacity: 0.95,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(15),
		lineHeight: 1.5,
	},
}));

export const StyledIconButton: FC<IconButtonProps> = styled(IconButton)(
	({ theme }) => ({
		height: 48,
		width: 48,
		borderRadius: 12,
		border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.14)}`,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: theme.palette.text.tertiary,
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.12)",
		backgroundColor: theme.palette.background.paper,
		transition: "all 0.2s ease",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
			transform: "translateY(-2px)",
		},
		[theme.breakpoints.down("sm")]: {
			height: 40,
			width: 40,
		},
	}),
) as typeof IconButton;

export const StyledContactUsIconButton = styled(StyledIconButton)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	border: "none",
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
		opacity: 1,
	},
})) as typeof IconButton;

export const StyledContactUsText = styled(Typography)(({ theme }) => ({
	color: theme.palette.primary.main,
	fontWeight: 700,
	textAlign: "center",
	display: "block",
	fontSize: "20px",
	lineHeight: "28px",
})) as typeof Typography;

export const StyledBoxSection = styled(Box)(({ theme }) => ({
	padding: "80px 112px",
	[theme.breakpoints.down("lg")]: {
		padding: "64px 48px",
	},
	[theme.breakpoints.down("sm")]: {
		padding: "56px 16px",
	},
}));
