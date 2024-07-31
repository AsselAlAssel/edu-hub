import { Class } from "@prisma/client";
import React from "react";
import ClassItem from "./ClassItem";
import { Grid } from "@mui/material";
import { ClassesWithResources } from "@/types/types";

export default function Classes({ classes }: { classes: ClassesWithResources[] }) {
	return (
		<Grid container spacing={2}>
			{classes.map((classItem) => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={classItem.id}>
					<ClassItem classItem={classItem} />
				</Grid>
			))}
		</Grid>
	);
}
