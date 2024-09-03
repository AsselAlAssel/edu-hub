import { getClasses } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage";
import { Stack } from "@mui/material";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
	title: "الصفوف",
	description: "الصفوف",
	openGraph: {
		title: "الصفوف",
		description: "الصفوف",
		type: "website",
		locale: "ar_AR",
		url: process.env.NEXT_PUBLIC_DOMAIN,
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_DOMAIN}/images/cover.png`,
				width: 1200,
				height: 630,
				alt: "الصفحة الرئيسية",
			},
		],
	},
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
