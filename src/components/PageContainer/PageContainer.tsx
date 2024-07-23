"use client";
import { styled } from "@mui/material";
import Container from "@mui/material/Container";

const PageContainer = styled(Container)(({ theme }) => ({
	maxWidth: "1216px !important",
	[theme.breakpoints.up("xs")]: {
		padding: "0 16px !important",
	},
	[theme.breakpoints.up("lg")]: {
		padding: "0px  !important",
	},
})) as typeof Container;

export default PageContainer;
