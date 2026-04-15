"use client";

import {
	Box,
	IconButton,
	IconButtonProps,
	Stack,
	styled,
	Typography,
} from "@mui/material";

export const StyledStack = styled(Stack)(({ theme }) => ({
	paddingTop: "120px",
	paddingBottom: "120px",
	position: "relative",
	[theme.breakpoints.down("sm")]: {
		paddingTop: "72px",
		paddingBottom: "80px",
	},
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(48),
	fontWeight: 800,
	lineHeight: 1.2,
	letterSpacing: "-0.02em",
	[theme.breakpoints.down("md")]: {
		fontSize: theme.typography.pxToRem(40),
		lineHeight: 1.25,
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(32),
		lineHeight: 1.3,
		textAlign: "center",
	},
}));

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(18),
	lineHeight: 1.6,
	color: "white",
	opacity: 0.9,
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(16),
		lineHeight: 1.5,
		textAlign: "center",
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
		border: `1px solid #EAECF0`,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#344054",
		boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
		backgroundColor: theme.palette.background.brand,
		transition: "all 0.2s ease",
		"&:hover": {
			backgroundColor: theme.palette.background.brand,
			transform: "translateY(-2px)",
		},
		[theme.breakpoints.down("sm")]: {
			height: 40,
			width: 40,
		},
	})
) as typeof IconButton;

export const StyledContactUsIconButton = styled(StyledIconButton)(
	({ theme }) => ({
		backgroundColor: theme.palette.text["brand-secondary"],
		color: "#FFFFFF",
		border: "none",
		"&:hover": {
			backgroundColor: theme.palette.background["brand-secondary"],
		},
	})
) as typeof IconButton;

export const StyledContactUsText = styled(Typography)({
	color: "primary.main",
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
