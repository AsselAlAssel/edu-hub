import { Resource } from "@prisma/client";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import ResourceCard from "./ResourceCard";

export default function FilesSection({ resources }: { resources: Resource[] }) {
	return (
		<Box>
			<Typography variant='h5' mb={2}>
				الملفات
			</Typography>
			<Grid container spacing={2}>
				{resources.map((resource) => (
					<Grid
						item
						key={resource.id}
						xs={12}
						md={6}
						lg={4}
						xl={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<ResourceCard resource={resource} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
