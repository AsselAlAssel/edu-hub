"use client";
import { alpha, Avatar, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

export default function UserInformation() {
	const { data } = useSession();
	const user = data?.user;
	return (
		<Stack
			spacing={2}
			sx={{
				marginTop: 4,
				lineHeight: 1.6,
				fontSize: "1.1rem",
				color: "text.tertiary",
				bgcolor: "#F3F8FF",
				maxWidth: "233px",
				width: "100%",
				borderRadius: 1.5,
				padding: 2,
			}}
		>
			<Avatar
				sx={(theme) => ({
					width: 40,
					height: 40,
					border: "1px solid",
					borderColor: alpha("#000", 0.08),
					backgroundColor: theme.palette.primary.main,
					fontSize: 20,
				})}
			>
				{user?.name?.[0]?.toUpperCase()}
			</Avatar>
			<Typography
				sx={{
					fontWeight: "600 !important",
				}}
			>
				{user?.name}
			</Typography>
			<Typography
				sx={{
					fontWeight: 400,
				}}
			>
				{user?.email}
			</Typography>
		</Stack>
	);
}
