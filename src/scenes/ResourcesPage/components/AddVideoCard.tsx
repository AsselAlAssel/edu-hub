import React from "react";
import { Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddVideoCard({ onClick }: { onClick: () => void }) {
	return (
		<Stack
			justifyContent={"center"}
			alignItems='center'
			sx={{
				borderRadius: 1,
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				backgroundColor: "#F0F4F9",
				flex: 1,
			}}
			gap={0.5}
			onClick={onClick}
		>
			<AddCircleOutlineIcon
				sx={{
					fontSize: 40,
				}}
			/>
			<Typography variant='h6'>إضافة فيديو جديد</Typography>
		</Stack>
	);
}
