"use client";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

/** Brand lockup: mark + "محمد صبح / فيزياء". Links home. */
export default function Logo({ onClick }: { onClick?: () => void }) {
	return (
		<Stack
			component={Link}
			href='/'
			onClick={onClick}
			aria-label='محمد صبح للفيزياء — الصفحة الرئيسية'
			direction='row'
			alignItems='center'
			gap={1.25}
			sx={{
				textDecoration: "none",
				color: "inherit",
				borderRadius: 1,
				flexShrink: 0,
				"&:hover .qa-logo-mark": { transform: "rotate(-8deg) scale(1.05)" },
			}}
		>
			<Box
				className='qa-logo-mark'
				sx={(theme) => ({
					width: 42,
					height: 42,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					backgroundColor: theme.tokens.colors.surfaceSecondary,
					border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.4)}`,
					boxShadow:
						theme.palette.mode === "dark"
							? `0 0 18px ${alpha(theme.tokens.colors.cyan, 0.22)}`
							: "none",
					transition: theme.transitions.create("transform"),
				})}
			>
				<Image
					src='/images/logo/logo.svg'
					alt=''
					width={30}
					height={30}
					priority
				/>
			</Box>
			<Stack spacing={0} sx={{ lineHeight: 1 }} aria-hidden>
				<Typography
					component='span'
					sx={{ fontWeight: 700, fontSize: "1.125rem", lineHeight: 1.3 }}
				>
					محمد صبح
				</Typography>
				<Typography
					component='span'
					sx={{
						fontWeight: 500,
						fontSize: "0.8125rem",
						color: "primary.main",
						lineHeight: 1.4,
					}}
				>
					منصة الفيزياء
				</Typography>
			</Stack>
		</Stack>
	);
}
