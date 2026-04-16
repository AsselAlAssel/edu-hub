"use client";

import {
	Box,
	IconButton,
	IconButtonProps,
	Stack,
	styled,
	Typography,
} from "@mui/material";

// ─── Dark Theme Palette ─────────────────────────────────────────────
// Base:    #060B18
// Surface: #0A1128
// Border:  rgba(0,180,216,0.1)
// Accent:  #00B4D8 (cyan), #7C3AED (purple)
// Text:    #FFFFFF, #94A3B8, #64748B

export const DARK = {
	bg: "#060B18",
	surface: "#0A1128",
	surfaceLight: "#0F1B35",
	border: "rgba(0,180,216,0.1)",
	borderHover: "rgba(0,180,216,0.25)",
	accent: "#00B4D8",
	accentDim: "rgba(0,180,216,0.15)",
	purple: "#7C3AED",
	purpleDim: "rgba(124,58,237,0.15)",
	text: "#FFFFFF",
	textSecondary: "#94A3B8",
	textMuted: "#64748B",
	glow: "0 0 60px rgba(0,180,216,0.15)",
	glowStrong: "0 0 80px rgba(0,180,216,0.25)",
	cardShadow: "0 8px 32px rgba(0,0,0,0.4)",
	cardShadowHover:
		"0 16px 48px rgba(0,180,216,0.12), 0 8px 24px rgba(0,0,0,0.3)",
} as const;

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

export const SectionLabel = styled(Typography)({
	fontSize: "0.8125rem",
	fontWeight: 700,
	letterSpacing: "0.12em",
	textTransform: "uppercase",
	color: DARK.accent,
	textAlign: "center",
	marginBottom: 12,
});

export const SectionTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(42),
	fontWeight: 800,
	lineHeight: 1.15,
	letterSpacing: "-0.02em",
	color: DARK.text,
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
	color: DARK.textSecondary,
	textAlign: "center",
	maxWidth: 600,
	margin: "0 auto",
	marginTop: 16,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(16),
	},
}));

export const GlassCard = styled(Box)({
	padding: 28,
	borderRadius: 20,
	backgroundColor: "rgba(10,17,40,0.6)",
	backdropFilter: "blur(20px)",
	WebkitBackdropFilter: "blur(20px)",
	border: `1px solid ${DARK.border}`,
	boxShadow: DARK.cardShadow,
	transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
	"&:hover": {
		borderColor: DARK.borderHover,
		boxShadow: DARK.cardShadowHover,
		transform: "translateY(-4px)",
	},
});

// ─── Legacy Styled (kept for backward compatibility) ────────────────

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(52),
	fontWeight: 800,
	lineHeight: 1.15,
	letterSpacing: "-0.03em",
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
	opacity: 0.85,
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
	color: "white",
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
	color: "white",
	textAlign: "center",
	maxWidth: 700,
	opacity: 0.9,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(15),
		lineHeight: 1.5,
	},
}));

export const StyledIconButton: React.FC<IconButtonProps> = styled(IconButton)(
	({ theme }) => ({
		height: 48,
		width: 48,
		borderRadius: 12,
		border: `1px solid ${DARK.border}`,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: DARK.textSecondary,
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.2)",
		backgroundColor: DARK.surface,
		transition: "all 0.2s ease",
		"&:hover": {
			backgroundColor: DARK.surfaceLight,
			transform: "translateY(-2px)",
		},
		[theme.breakpoints.down("sm")]: {
			height: 40,
			width: 40,
		},
	})
) as typeof IconButton;

export const StyledContactUsIconButton = styled(StyledIconButton)(() => ({
	backgroundColor: DARK.accent,
	color: "#FFFFFF",
	border: "none",
	"&:hover": {
		backgroundColor: DARK.accent,
		opacity: 0.9,
	},
})) as typeof IconButton;

export const StyledContactUsText = styled(Typography)({
	color: DARK.accent,
	fontWeight: 700,
	textAlign: "center",
	display: "block",
	fontSize: "20px",
	lineHeight: "28px",
}) as typeof Typography;

export const StyledBoxSection = styled(Box)(({ theme }) => ({
	padding: "80px 112px",
	[theme.breakpoints.down("lg")]: {
		padding: "64px 48px",
	},
	[theme.breakpoints.down("sm")]: {
		padding: "56px 16px",
	},
}));
