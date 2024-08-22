import { getClasses } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage";
import { Stack } from "@mui/material";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
	title: "الصفوف",
	description: "الصفوف",
};
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
