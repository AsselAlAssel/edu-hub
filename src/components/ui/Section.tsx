"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Stack, Typography, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";

/** Full-width landing band with consistent vertical rhythm. */
export function Section({
	children,
	tone = "default",
	sx,
	...props
}: BoxProps & { tone?: "default" | "muted" }) {
	return (
		<Box
			component='section'
			sx={[
				(theme) => ({
					position: "relative",
					py: { xs: 8, md: 12 },
					backgroundColor:
						tone === "muted"
							? theme.tokens.colors.surfaceSecondary
							: "transparent",
					borderTop:
						tone === "muted"
							? `1px solid ${theme.tokens.colors.border}`
							: "none",
					borderBottom:
						tone === "muted"
							? `1px solid ${theme.tokens.colors.border}`
							: "none",
				}),
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
			{...props}
		>
			<PageContainer>{children}</PageContainer>
		</Box>
	);
}

/** Eyebrow + heading + supporting copy for a section. */
export function SectionHeader({
	eyebrow,
	title,
	description,
	align = "center",
	titleId,
	as = "h2",
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	align?: "center" | "start";
	titleId?: string;
	as?: "h2" | "h3";
}) {
	return (
		<Stack
			spacing={1.5}
			sx={{
				textAlign: align,
				alignItems: align === "center" ? "center" : "flex-start",
				mb: { xs: 5, md: 7 },
				maxWidth: align === "center" ? 720 : "none",
				mx: align === "center" ? "auto" : 0,
			}}
		>
			{eyebrow ? (
				<Typography
					variant='overline'
					component='p'
					sx={(theme) => ({
						color: "primary.main",
						display: "inline-flex",
						alignItems: "center",
						gap: 1,
						"&::before": {
							content: '""',
							width: 18,
							height: 2,
							borderRadius: 2,
							backgroundColor: theme.palette.primary.main,
						},
					})}
				>
					{eyebrow}
				</Typography>
			) : null}
			<Typography variant='h2' component={as} id={titleId}>
				{title}
			</Typography>
			{description ? (
				<Typography
					variant='subtitle1'
					component='p'
					sx={{ color: "text.secondary" }}
				>
					{description}
				</Typography>
			) : null}
		</Stack>
	);
}
