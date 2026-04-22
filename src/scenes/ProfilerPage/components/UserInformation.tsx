"use client";
import { alpha, Avatar, Box, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

export default function UserInformation() {
	const { data } = useSession();
	const user = data?.user;
	return (
		<Stack
			spacing={3}
			sx={(theme) => ({
				marginTop: 4,
				bgcolor: theme.palette.background.paper,
				maxWidth: "260px",
				width: "100%",
				borderRadius: "16px",
				padding: 3,
				border: "1px solid",
				borderColor:
					theme.palette.mode === "light"
						? theme.palette.border.main
						: theme.palette.divider,
				boxShadow:
					theme.palette.mode === "dark"
						? `0 8px 24px ${alpha("#000", 0.35)}`
						: `0 1px 2px ${alpha("#0F172A", 0.05)}, 0 8px 24px ${alpha("#0F172A", 0.06)}`,
				height: "fit-content",
			})}
		>
			<Avatar
				sx={(theme) => ({
					width: 52,
					height: 52,
					border: "2px solid",
					borderColor: alpha(theme.palette.primary.main, 0.15),
					backgroundColor: theme.palette.primary.main,
					fontSize: 22,
					fontWeight: 700,
				})}
			>
				{user?.name?.[0]?.toUpperCase()}
			</Avatar>
			<Box>
				<Typography
					sx={(theme) => ({
						fontWeight: 700,
						fontSize: "1.0625rem",
						mb: 0.5,
						color: theme.palette.text.primary,
					})}
				>
					{user?.name}
				</Typography>
				<Typography
					sx={{
						fontWeight: 400,
						color: "text.tertiary",
						fontSize: "0.875rem",
					}}
				>
					{user?.email}
				</Typography>
			</Box>
		</Stack>
	);
}
