import React from "react";
import { Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddFolderCard({ onClick }: { onClick: () => void }) {
	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={{
				border: "1px solid #E0E0E0",
				borderRadius: 1,
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				backgroundColor: "#F0F4F9",
			}}
			gap={1}
			onClick={onClick}
		>
			<Stack direction='row' gap={1} alignItems='center'>
				<AddCircleOutlineIcon />
				<Typography variant='h6'>إضافة مجلد جديد</Typography>
			</Stack>
		</Stack>
	);
}
