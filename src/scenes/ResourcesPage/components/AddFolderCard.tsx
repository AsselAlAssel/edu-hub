import React from "react";
import { alpha, Stack, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddFolderCard({ onClick }: { onClick: () => void }) {
	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={(theme) => ({
				border: `1px dashed ${theme.palette.border.main}`,
				borderRadius: "10px",
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor: "transparent",
				transition: "all 0.2s ease",
				"&:hover": {
					borderColor: theme.palette.primary.main,
					backgroundColor: alpha(theme.palette.primary.main, 0.06),
				},
			})}
			gap={1}
			onClick={onClick}
		>
			<Stack direction='row' gap={1} alignItems='center'>
				<AddCircleOutlineIcon color='primary' />
				<Typography variant='h6'>إضافة مجلد جديد</Typography>
			</Stack>
		</Stack>
	);
}
