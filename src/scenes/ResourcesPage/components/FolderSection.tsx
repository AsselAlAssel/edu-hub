import { Box, Grid, Typography } from "@mui/material";
import { Folder } from "@prisma/client";
import React from "react";
import FolderCard from "./FolderCard";

export default function FolderSection({ folders }: { folders: Folder[] }) {
	return (
		<Box>
			<Typography variant='h5' mb={2}>
				المجلدات
			</Typography>
			<Grid container spacing={2}>
				{folders.map((folder) => (
					<Grid
						item
						key={folder.id}
						xs={12}
						md={6}
						lg={4}
						xl={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<FolderCard folder={folder} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
