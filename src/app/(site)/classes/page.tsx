import { getClasses } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage";
import { Stack } from "@mui/material";
import React, { Suspense } from "react";

export default async function page() {
	const classes = await getClasses();
	return (
		<Suspense
			fallback={
				<Stack justifyContent={"center"} alignItems={"center"}>
					Loading...
				</Stack>
			}
		>
			<ClassesPage classes={classes} />
		</Suspense>
	);
}
