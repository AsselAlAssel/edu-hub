"use client";
import { styled } from "@mui/material";
import Container from "@mui/material/Container";
import { APP_BAR_HEIGHT } from "../Common/Dashboard/Header";

const PageContainer = styled(Container)(({ theme }) => ({
	maxWidth: "1216px !important",
	[theme.breakpoints.up("xs")]: {
		padding: "0 16px !important",
	},
	[theme.breakpoints.up("lg")]: {
		padding: "0px  !important",
	},
	minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
})) as typeof Container;

export default PageContainer;
