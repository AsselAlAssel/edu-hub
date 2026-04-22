"use client";

import {
	alpha,
	Box,
	Button,
	ButtonProps,
	Stack,
	Typography,
	TypographyProps,
	styled,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { shadows, radii } from "../../../theme";
import { forwardRef, type ReactNode } from "react";

// ─── Section Wrapper ────────────────────────────────────────────────

interface SectionWrapperProps {
	children: ReactNode;
	id?: string;
	background?: "default" | "muted" | "brand";
	maxWidth?: number;
	noPadding?: boolean;
}

export function SectionWrapper({
	children,
	id,
	background = "default",
	maxWidth = 1200,
	noPadding = false,
}: SectionWrapperProps) {
	const bgFor = (theme: Theme) =>
		background === "default"
			? theme.palette.background.paper
			: background === "muted"
				? theme.palette.background.default
				: theme.palette.background["brand-section"];

	return (
		<Box
			id={id}
			component='section'
			sx={(theme) => ({
				backgroundColor: bgFor(theme),
				position: "relative",
			})}
		>
			<Box
				sx={{
					maxWidth,
					mx: "auto",
					width: "100%",
					px: noPadding ? 0 : { xs: 2.5, sm: 4, md: 6 },
					py: { xs: 8, sm: 10, md: 12 },
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

// ─── Section Header ─────────────────────────────────────────────────

interface SectionHeaderProps {
	label?: string;
	title: string;
	subtitle?: string;
	align?: "center" | "start";
	titleProps?: TypographyProps;
}

export function SectionHeader({
	label,
	title,
	subtitle,
	align = "center",
	titleProps,
}: SectionHeaderProps) {
	return (
		<Stack
			spacing={1.5}
			sx={{
				textAlign: align,
				mb: { xs: 5, md: 7 },
				alignItems: align === "center" ? "center" : "flex-start",
				color: "text.primary",
			}}
		>
			{label && (
				<Typography
					sx={{
						fontSize: "0.8125rem",
						fontWeight: 700,
						letterSpacing: "0.08em",
						textTransform: "uppercase",
						color: "primary.main",
					}}
				>
					{label}
				</Typography>
			)}
			<Typography
				variant='h3'
				sx={{
					fontWeight: 800,
					letterSpacing: "-0.01em",
					color: "text.primary",
				}}
				{...titleProps}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography
					sx={{
						fontSize: { xs: "1rem", sm: "1.0625rem" },
						color: "text.tertiary",
						lineHeight: 1.7,
						maxWidth: align === "center" ? 540 : undefined,
					}}
				>
					{subtitle}
				</Typography>
			)}
		</Stack>
	);
}

// ─── Card Wrapper ───────────────────────────────────────────────────

export const CardWrapper = styled(Box)(({ theme }) => ({
	borderRadius: radii.lg,
	border: `1px solid ${theme.palette.border.secondary}`,
	backgroundColor: theme.palette.background.paper,
	boxShadow: shadows.card,
	overflow: "hidden",
	transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
	"&:hover": {
		boxShadow: shadows.cardHover,
		borderColor: theme.palette.border.main,
		transform: "translateY(-3px)",
	},
}));

// ─── Glass Card ─────────────────────────────────────────────────────

export const GlassCard = styled(Box)(({ theme }) => ({
	borderRadius: radii.xl,
	border: `1px solid ${theme.palette.border.secondary}`,
	backgroundColor: theme.palette.background.paper,
	boxShadow: `${shadows.sm}, 0 0 0 1px rgba(0,0,0,0.02)`,
	padding: 28,
	transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
	"&:hover": {
		boxShadow: shadows.lg,
		borderColor: theme.palette.border.main,
		transform: "translateY(-2px)",
	},
}));

// ─── Custom Buttons ─────────────────────────────────────────────────

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
	function PrimaryButton(props, ref) {
		const { sx, ...rest } = props;
		return (
			<Button
				ref={ref}
				variant='contained'
				{...rest}
				sx={[
					(theme) => ({
						borderRadius: `${radii.md}px`,
						fontWeight: 600,
						boxShadow: `${shadows.xs}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.12)}`,
						"&:hover": {
							boxShadow: `${shadows.md}, 0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
						},
					}),
					...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
				]}
			/>
		);
	}
);

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
	function SecondaryButton(props, ref) {
		return (
			<Button
				ref={ref}
				variant='contained'
				color='secondary'
				{...props}
				sx={{
					borderRadius: `${radii.md}px`,
					fontWeight: 600,
					...props.sx,
				}}
			/>
		);
	}
);

// ─── Separator ──────────────────────────────────────────────────────

export function SectionSeparator() {
	return (
		<Box
			sx={(theme) => ({
				height: 1,
				background: `linear-gradient(90deg, transparent 0%, ${theme.palette.divider} 50%, transparent 100%)`,
			})}
		/>
	);
}
