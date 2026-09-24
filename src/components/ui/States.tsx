"use client";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import IconTile from "./IconTile";
import Surface from "./Surface";

type StateProps = {
	title: string;
	description?: ReactNode;
	icon?: ReactNode;
	action?: ReactNode;
	compact?: boolean;
};

function StateLayout({
	title,
	description,
	icon,
	action,
	compact,
	tone,
	role,
}: StateProps & { tone: "primary" | "error"; role?: "alert" | "status" }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 14, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
		>
			<Surface
				variant='secondary'
				role={role}
				sx={(theme) => ({
					overflow: "hidden",
					borderStyle: "dashed",
					borderColor: theme.tokens.colors.borderStrong,
					boxShadow: "none",
					px: 3,
					py: compact ? 5 : { xs: 7, md: 10 },
					// Faint lab grid behind the message.
					backgroundImage: `linear-gradient(${theme.tokens.colors.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.tokens.colors.border} 1px, transparent 1px)`,
					backgroundSize: "40px 40px",
					backgroundPosition: "center",
				})}
			>
				<Stack
					alignItems='center'
					textAlign='center'
					spacing={2}
					sx={{ maxWidth: 460, mx: "auto", position: "relative" }}
				>
					<Box
						sx={{
							animation:
								tone === "error"
									? "qaNudge 600ms ease 1"
									: "qaFloat 5s ease-in-out infinite",
							"@keyframes qaFloat": {
								"0%, 100%": { transform: "translateY(0)" },
								"50%": { transform: "translateY(-8px)" },
							},
							"@keyframes qaNudge": {
								"0%, 100%": { transform: "translateX(0)" },
								"25%": { transform: "translateX(-5px)" },
								"75%": { transform: "translateX(5px)" },
							},
						}}
					>
						<IconTile tone={tone} size={compact ? 52 : 68}>
							{icon}
						</IconTile>
					</Box>
					<Typography variant='h5' component='p'>
						{title}
					</Typography>
					{description ? (
						<Typography variant='body2' sx={{ color: "text.secondary" }}>
							{description}
						</Typography>
					) : null}
					{action ? <Stack pt={1}>{action}</Stack> : null}
				</Stack>
			</Surface>
		</motion.div>
	);
}

export function EmptyState({ icon, ...props }: StateProps) {
	return (
		<StateLayout
			tone='primary'
			role='status'
			icon={icon ?? <InboxOutlinedIcon />}
			{...props}
		/>
	);
}

export function ErrorState({
	title = "تعذّر تحميل المحتوى",
	description = "حدث خطأ غير متوقع. تحقّق من الاتصال ثم حاول مرة أخرى.",
	...props
}: Partial<StateProps>) {
	return (
		<StateLayout
			tone='error'
			role='alert'
			icon={<ErrorOutlineRoundedIcon />}
			title={title}
			description={description}
			{...props}
		/>
	);
}

/** Orbit loader: a nucleus with two counter-rotating electron rings. */
export function OrbitLoader({ size = 44 }: { size?: number }) {
	return (
		<Box
			aria-hidden
			sx={(theme) => ({
				position: "relative",
				width: size,
				height: size,
				"& > span": {
					position: "absolute",
					inset: 0,
					borderRadius: "50%",
					border: "2px solid transparent",
					animation: "qaSpin 1.1s linear infinite",
				},
				"& > span:nth-of-type(1)": {
					borderTopColor: theme.tokens.colors.cyan,
					borderRightColor: theme.tokens.colors.cyan,
				},
				"& > span:nth-of-type(2)": {
					inset: "22%",
					borderBottomColor: theme.tokens.colors.violet,
					borderLeftColor: theme.tokens.colors.violet,
					animationDirection: "reverse",
					animationDuration: "0.8s",
				},
				"&::after": {
					content: '""',
					position: "absolute",
					inset: "42%",
					borderRadius: "50%",
					backgroundColor: theme.tokens.colors.cyan,
					boxShadow: `0 0 12px ${theme.tokens.colors.cyan}`,
				},
				"@keyframes qaSpin": { to: { transform: "rotate(360deg)" } },
			})}
		>
			<span />
			<span />
		</Box>
	);
}

export function LoadingState({ label = "جارٍ التحميل…" }: { label?: string }) {
	return (
		<Stack
			role='status'
			aria-live='polite'
			alignItems='center'
			justifyContent='center'
			spacing={2.5}
			sx={{ py: 10 }}
		>
			<OrbitLoader />
			<Typography
				variant='body2'
				sx={{ color: "text.secondary", fontWeight: 500 }}
			>
				{label}
			</Typography>
		</Stack>
	);
}
