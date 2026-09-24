"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Stack, Typography, type BoxProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Reveal } from "./motion";

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
				(theme) => {
					const tint = theme.palette.mode === "dark" ? 0.45 : 1;
					const muted = alpha(theme.tokens.colors.surfaceSecondary, tint);
					return {
						position: "relative",
						py: { xs: 9, md: 14 },
						backgroundColor: tone === "muted" ? muted : "transparent",
						borderBlock:
							tone === "muted"
								? `1px solid ${theme.tokens.colors.border}`
								: "none",
					};
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
			{...props}
		>
			<PageContainer>{children}</PageContainer>
		</Box>
	);
}

/** Eyebrow + large heading + supporting copy; reveals on scroll. */
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
		<Reveal>
			<Stack
				spacing={2}
				sx={{
					textAlign: align,
					alignItems: align === "center" ? "center" : "flex-start",
					mb: { xs: 6, md: 8 },
					maxWidth: align === "center" ? 760 : "none",
					mx: align === "center" ? "auto" : 0,
				}}
			>
				{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
				<Typography
					variant='h2'
					component={as}
					id={titleId}
					sx={{
						fontSize: { xs: "2rem", sm: "2.5rem", md: "3.25rem" },
						lineHeight: 1.3,
						textWrap: "balance",
					}}
				>
					{title}
				</Typography>
				{description ? (
					<Typography
						variant='subtitle1'
						component='p'
						sx={{
							color: "text.secondary",
							fontSize: { md: "1.1875rem" },
							maxWidth: 640,
						}}
					>
						{description}
					</Typography>
				) : null}
			</Stack>
		</Reveal>
	);
}

/** Small cyan label with a glowing lead-in bar. */
export function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<Typography
			variant='overline'
			component='p'
			sx={(theme) => ({
				color: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
				display: "inline-flex",
				alignItems: "center",
				gap: 1.25,
				fontWeight: 600,
				"&::before": {
					content: '""',
					width: 28,
					height: 2,
					borderRadius: 2,
					backgroundImage: theme.tokens.gradients.primary,
					boxShadow:
						theme.palette.mode === "dark"
							? `0 0 10px ${alpha(theme.tokens.colors.cyan, 0.7)}`
							: "none",
				},
			})}
		>
			{children}
		</Typography>
	);
}

/**
 * Decorative divider between landing sections: a hairline beam with a light
 * pulse travelling along it (transform-only, stops under reduced motion).
 */
export function ScienceDivider() {
	return (
		<Box
			aria-hidden
			sx={{ position: "relative", height: 2, overflow: "hidden" }}
		>
			<Box
				sx={(theme) => ({
					position: "absolute",
					inset: 0,
					background: `linear-gradient(90deg, transparent, ${alpha(theme.tokens.colors.cyan, 0.35)} 30%, ${alpha(theme.tokens.colors.violet, 0.35)} 70%, transparent)`,
				})}
			/>
			<Box
				sx={(theme) => ({
					position: "absolute",
					top: 0,
					bottom: 0,
					width: "18%",
					background: `linear-gradient(90deg, transparent, ${theme.tokens.colors.cyan}, transparent)`,
					animation: "qaBeam 5s cubic-bezier(0.45, 0, 0.55, 1) infinite",
					"@keyframes qaBeam": {
						from: { transform: "translateX(-120%)" },
						to: { transform: "translateX(660%)" },
					},
				})}
			/>
		</Box>
	);
}
