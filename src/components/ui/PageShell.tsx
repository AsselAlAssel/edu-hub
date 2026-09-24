"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";
import { PageTransition } from "./motion";
import { Eyebrow } from "./Section";

/** Standard inner page: container + vertical rhythm + entrance transition. */
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
			<PageTransition>{children}</PageTransition>
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
				mb: { xs: 4, md: 6 },
				pb: { xs: 3, md: 4 },
				borderBottom: `1px solid ${theme.tokens.colors.border}`,
				// Glowing accent under the start of the title rule.
				"&::after": {
					content: '""',
					position: "absolute",
					insetInlineStart: 0,
					bottom: -1,
					width: 120,
					height: 2,
					backgroundImage: theme.tokens.gradients.primary,
					boxShadow:
						theme.palette.mode === "dark"
							? `0 0 14px ${alpha(theme.tokens.colors.cyan, 0.7)}`
							: "none",
				},
			})}
		>
			{/* Soft light behind the title (decorative). */}
			<Box
				aria-hidden
				sx={(theme) => ({
					position: "absolute",
					insetInlineStart: -80,
					top: -120,
					width: 420,
					height: 300,
					pointerEvents: "none",
					zIndex: -1,
					background: `radial-gradient(closest-side, ${alpha(theme.tokens.colors.cyan, 0.12)}, transparent)`,
				})}
			/>
			{children}
			<Stack
				direction={{ xs: "column", md: "row" }}
				alignItems={{ xs: "stretch", md: "flex-end" }}
				justifyContent='space-between'
				gap={3}
			>
				<Box sx={{ minWidth: 0 }}>
					{eyebrow ? (
						<Box sx={{ mb: 1.5 }}>
							<Eyebrow>{eyebrow}</Eyebrow>
						</Box>
					) : null}
					<Typography
						variant='h1'
						sx={{
							fontSize: { xs: "2.125rem", md: "3rem" },
							lineHeight: 1.3,
							overflowWrap: "anywhere",
						}}
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
