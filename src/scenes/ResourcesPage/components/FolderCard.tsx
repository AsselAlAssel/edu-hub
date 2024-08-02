import { Folder } from "@prisma/client";
import React from "react";
import { Stack, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";

export default function FolderCard({ folder }: { folder: Folder }) {
	console.log(folder);
	return (
		<Link
			href={`/class/${folder.classId}/folder/${folder.id}`}
			style={{ width: "100%" }}
		>
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
			>
				<Stack direction='row' gap={1} alignItems='center'>
					<FolderIcon />
					<Typography variant='h6'>{folder.name}</Typography>
				</Stack>
			</Stack>
		</Link>
	);
}
