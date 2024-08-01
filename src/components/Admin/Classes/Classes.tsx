import { ClassesWithResources } from "@/types/types";
import { Grid } from "@mui/material";
import ClassItem from "./ClassItem";

export default function Classes({
	classes,
}: {
	classes: ClassesWithResources[];
}) {
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
