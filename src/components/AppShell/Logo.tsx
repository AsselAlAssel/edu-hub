"use client";
import { Box, Stack, Typography } from "@mui/material";
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
			}}
		>
			<Box
				sx={(theme) => ({
					width: 40,
					height: 40,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					backgroundColor: theme.tokens.colors.surfaceSecondary,
					border: `1px solid ${theme.tokens.colors.border}`,
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
					sx={{ fontWeight: 800, fontSize: "1.0625rem", lineHeight: 1.2 }}
				>
					محمد صبح
				</Typography>
				<Typography
					component='span'
					sx={{
						fontWeight: 600,
						fontSize: "0.75rem",
						color: "text.secondary",
						lineHeight: 1.3,
					}}
				>
					منصة الفيزياء
				</Typography>
			</Stack>
		</Stack>
	);
}
