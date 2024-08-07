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
	paddingTop: "155px",
	paddingBottom: "163px",
	position: "relative",
	[theme.breakpoints.down("sm")]: {
		paddingTop: "70px",
		paddingBottom: "100px",
	},
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(60),
	fontWeight: 500,
	lineHeight: theme.typography.pxToRem(76),
	letterSpacing: theme.typography.pxToRem(-0.2),
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(48),
		lineHeight: theme.typography.pxToRem(56),
		textAlign: "center",
	},
}));

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(20),
	lineHeight: theme.typography.pxToRem(30),
	color: "white",
	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(18),
		lineHeight: theme.typography.pxToRem(28),
		textAlign: "center",
	},
}));

export const StyledSectionTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(28),
	fontWeight: 500,
	lineHeight: theme.typography.pxToRem(36),
	letterSpacing: theme.typography.pxToRem(-0.2),

	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(20),
		lineHeight: theme.typography.pxToRem(28),
		textAlign: "center",
	},
}));

export const StyledSectionSubTitle = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(18),
	lineHeight: theme.typography.pxToRem(30),

	[theme.breakpoints.down("sm")]: {
		fontSize: theme.typography.pxToRem(14),
		lineHeight: theme.typography.pxToRem(22),
	},
}));

export const StyledIconButton: React.FC<IconButtonProps> = styled(IconButton)(
	({ theme }) => ({
		height: 48,
		width: 48,
		borderRadius: 10,
		border: `1px solid #EAECF0`,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#344054",
		boxShadow: "0px 1px 2px 0px #1018280D",
		backgroundColor: theme.palette.background.brand,
		"&:hover": {
			backgroundColor: theme.palette.background.brand,
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
	color: "#fff",
	fontWeight: 600,
	textAlign: "center",
	display: "block",
}) as typeof Typography;

export const StyledBoxSection = styled(Box)(({ theme }) => ({
	padding: "96px 112px",
	[theme.breakpoints.down("lg")]: {
		padding: "72px 50px",
	},
	[theme.breakpoints.down("sm")]: {
		padding: "64px 0px",
	},
}));
