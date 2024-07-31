'use client';

import { Stack, styled, Typography } from "@mui/material";

export const StyledStack = styled(Stack)(({ theme }) => ({
    paddingTop: "155px",
    paddingBottom: "163px",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
        paddingTop: "70px",
        paddingBottom: "100px",
    },
}))

export const StyledTitle = styled(Typography)(({ theme }) => ({

    fontSize: theme.typography.pxToRem(60),
    fontWeight: 500,
    lineHeight: theme.typography.pxToRem(76),
    letterSpacing: theme.typography.pxToRem(-0.2),
    [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.pxToRem(48),
        lineHeight: theme.typography.pxToRem(56),
    },
}))

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(20),
    lineHeight: theme.typography.pxToRem(30),
    [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.pxToRem(18),
        lineHeight: theme.typography.pxToRem(28),
    },
})) 