import { getClass, getResources } from "@/libs/class";
import { getBreadcrumbs } from "@/libs/folder";
import ResourcesPage from "@/scenes/ResourcesPage";
import { Stack, CircularProgress } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
	title: "الموارد",
	description: "الموارد",
	openGraph: {
		title: "الموارد",
		description: "الموارد",
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

export default async function Page({
	params,
}: {
	params: {
		classId: string;
		folderId: string;
	};
}) {
	const { classId, folderId } = params;

	// Ensure folderId is provided
	if (!folderId) {
		return notFound();
	}

	try {
		// Fetch the class and root folder ID
		const classItem = await getClass(classId);
		const rootFolderId = classItem?.folders[0]?.id;

		// Handle cases where class or root folder ID is not found
		if (!classItem || !rootFolderId) {
			return notFound();
		}

		// Fetch resources for the specified folder
		const resources = await getResources(folderId);
		const isRootFolder = rootFolderId === folderId;

		const breadcrumb = await getBreadcrumbs(folderId);

		return (
			<Suspense
				fallback={
					<Stack justifyContent='center' alignItems='center' height='100vh'>
						<CircularProgress />
					</Stack>
				}
			>
				<ResourcesPage
					resources={resources}
					folderId={folderId}
					isRootFolder={isRootFolder}
					className={classItem.name}
					classId={classId}
					breadcrumb={breadcrumb}
				/>
			</Suspense>
		);
	} catch (error) {
		// Log the error for debugging
		console.error("Error loading class or resources:", error);

		// Optionally, return a more user-friendly error page or message
		return notFound();
	}
}
