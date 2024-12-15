import { getClass, getResources } from "@/libs/class";
import { getBreadcrumbs } from "@/libs/folder";
import ResourcesPage from "@/scenes/ResourcesPage";
import { Stack, CircularProgress } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
export const metadata: Metadata = {
	title: "موارد الفيزياء - شروحات ومصادر تعليمية | محمد صبح",
	description:
		"اكتشف موارد الفيزياء لجميع المراحل الدراسية من إعداد الأستاذ محمد صبح. شروحات ومصادر تعليمية مجانية لتسهيل تعلم الفيزياء بأسلوب ممتع.",
	openGraph: {
		title: "موارد الفيزياء - شروحات ومصادر تعليمية | محمد صبح",
		description:
			"أفضل الموارد التعليمية في الفيزياء لجميع الطلاب. اكتشف شروحات ومصادر مميزة من إعداد الأستاذ محمد صبح لتعلم الفيزياء بسهولة.",
		type: "website",
		locale: "ar_AR",
		url: process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com",
		images: [
			{
				url: `${
					process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com"
				}/images/cover.png`,
				width: 1200,
				height: 630,
				alt: "موارد الفيزياء - محمد صبح",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "موارد الفيزياء - شروحات ومصادر تعليمية | محمد صبح",
		description:
			"شروحات ومصادر تعليمية لتعلم الفيزياء لجميع المراحل الدراسية من إعداد الأستاذ محمد صبح.",
		images: [
			`${
				process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com"
			}/images/cover.png`,
		],
		creator: "@mohammedsubuh", // ضع اسم حساب تويتر الخاص بك إن وجد
	},
	keywords: [
		"موارد الفيزياء",
		"شروحات الفيزياء",
		"مصادر الفيزياء",
		"صفوف الفيزياء",
		"شروحات الفيزياء",
		"شروحات الفيزياء",
		"محمد صبح",
		"فيزياء محمد صبح",
		"mohammed subuh physics",
		"mohammed subuh website",
		"mohammed subuh physics lessons",
		"Mohammed Subuh physics",
		"Mohammed Subuh",
		"Mohammed Subuh website",
		"Mohammed Subuh Physics Lessons",
		"فيزياء لجميع المراحل الدراسية",
		"أفضل موارد الفيزياء",
	],
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
		// Fetch the class, root folder ID, resources, and breadcrumb concurrently
		const [classItem, resources, breadcrumb] = await Promise.all([
			getClass(classId), // Fetch the class
			getResources(folderId), // Fetch resources for the specified folder
			getBreadcrumbs(folderId), // Fetch breadcrumb
		]);

		// Handle cases where class or root folder ID is not found
		if (!classItem || !classItem.folders[0]?.id) {
			return notFound();
		}

		// Check if the current folder is the root folder
		const rootFolderId = classItem.folders[0].id;
		const isRootFolder = rootFolderId === folderId;

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
