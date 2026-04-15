"use client";
import { alpha, Avatar, Box, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

export default function UserInformation() {
	const { data } = useSession();
	const user = data?.user;
	return (
		<Stack
			spacing={2.5}
			sx={{
				marginTop: 4,
				bgcolor: "#FAFBFC",
				maxWidth: "260px",
				width: "100%",
				borderRadius: 3,
				padding: 3,
				border: "1px solid",
				borderColor: "border.secondary",
				boxShadow:
					"0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
				height: "fit-content",
			}}
		>
			<Avatar
				sx={(theme) => ({
					width: 48,
					height: 48,
					border: "2px solid",
					borderColor: alpha(theme.palette.primary.main, 0.2),
					backgroundColor: theme.palette.primary.main,
					fontSize: 22,
					fontWeight: 700,
				})}
			>
				{user?.name?.[0]?.toUpperCase()}
			</Avatar>
			<Box>
				<Typography
					sx={{
						fontWeight: 600,
						fontSize: "1.0625rem",
						mb: 0.5,
					}}
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
