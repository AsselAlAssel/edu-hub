import { getClasses } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage";
import React, { Suspense } from "react";

export default async function page() {
	const classes = await getClasses();
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClassesPage classes={classes} />
		</Suspense>
	);
}
