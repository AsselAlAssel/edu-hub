import React from "react";
import { Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddFolderCard({ onClick }: { onClick: () => void }) {
	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={{
				border: "1px dashed #D0D5DD",
				borderRadius: "10px",
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				backgroundColor: "transparent",
				transition: "all 0.2s ease",
				"&:hover": {
					borderColor: "#0088DD",
					backgroundColor: "rgba(0, 136, 221, 0.04)",
				},
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
