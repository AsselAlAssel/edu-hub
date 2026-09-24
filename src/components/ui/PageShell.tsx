"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

/** Standard inner page: container + vertical rhythm + bottom breathing room. */
export function PageShell({
	children,
	width = "default",
}: {
	children: ReactNode;
	width?: "default" | "narrow";
}) {
	return (
		<PageContainer
			sx={{
				py: { xs: 4, md: 6 },
				...(width === "narrow" && { maxWidth: 560 }),
			}}
		>
			{children}
		</PageContainer>
	);
}

/** Page title block: eyebrow, h1, description and optional actions. */
export function PageHeader({
	eyebrow,
	title,
	description,
	actions,
	children,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<Box
			component='header'
			sx={(theme) => ({
				position: "relative",
				mb: { xs: 4, md: 5 },
				pb: { xs: 3, md: 4 },
				borderBottom: `1px solid ${theme.tokens.colors.border}`,
			})}
		>
			{children}
			<Stack
				direction={{ xs: "column", md: "row" }}
				alignItems={{ xs: "stretch", md: "flex-end" }}
				justifyContent='space-between'
				gap={3}
			>
				<Box sx={{ minWidth: 0 }}>
					{eyebrow ? (
						<Typography
							variant='overline'
							component='p'
							sx={{ color: "primary.main", mb: 1 }}
						>
							{eyebrow}
						</Typography>
					) : null}
					<Typography
						variant='h1'
						sx={{ fontSize: { xs: "1.875rem", md: "2.5rem" } }}
					>
						{title}
					</Typography>
					{description ? (
						<Typography
							variant='subtitle1'
							component='p'
							sx={{ color: "text.secondary", mt: 1.5, maxWidth: 680 }}
						>
							{description}
						</Typography>
					) : null}
				</Box>
				{actions ? (
					<Stack direction='row' gap={1.5} flexWrap='wrap' flexShrink={0}>
						{actions}
					</Stack>
				) : null}
			</Stack>
		</Box>
	);
}
