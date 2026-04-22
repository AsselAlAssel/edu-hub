import React from "react";
import { alpha, Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddVideoCard({ onClick }: { onClick: () => void }) {
	return (
		<Stack
			justifyContent={"center"}
			alignItems='center'
			sx={(theme) => ({
				borderRadius: 1,
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor:
					theme.palette.mode === "dark"
						? alpha(theme.palette.background.paper, 0.9)
						: alpha(theme.palette.primary.main, 0.04),
				border: `1px solid ${theme.palette.border.secondary}`,
				flex: 1,
				transition: "all 0.2s ease",
				"&:hover": {
					backgroundColor:
						theme.palette.mode === "dark"
							? theme.palette.background.paper
							: alpha(theme.palette.primary.main, 0.08),
				},
			})}
			gap={0.5}
			onClick={onClick}
		>
			<AddCircleOutlineIcon
				sx={{
					fontSize: 40,
					color: "primary.main",
				}}
			/>
			<Typography variant='h6'>إضافة فيديو جديد</Typography>
		</Stack>
	);
}
