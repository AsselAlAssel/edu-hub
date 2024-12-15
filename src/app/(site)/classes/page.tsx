import { getClasses } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage";
import { Stack } from "@mui/material";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
	title: "صفوف الفيزياء - جميع المراحل الدراسية | محمد صبح",
	description:
		"استعرض جميع صفوف الفيزياء من إعداد الأستاذ محمد صبح (Mohammed Subuh). تعلم الفيزياء لجميع المراحل الدراسية بأسلوب بسيط ومبتكر.",
	openGraph: {
		title: "صفوف الفيزياء - جميع المراحل الدراسية | محمد صبح",
		description:
			"استعرض جميع صفوف الفيزياء لجميع المراحل الدراسية. شروحات الفيزياء من إعداد الأستاذ محمد صبح بأسلوب سلس وممتع.",
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
				alt: "صفوف الفيزياء - محمد صبح",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "صفوف الفيزياء - جميع المراحل الدراسية | محمد صبح",
		description:
			"أفضل موقع لشروحات الفيزياء لجميع الصفوف الدراسية. تعلم الفيزياء من الأستاذ محمد صبح بأسلوب مميز وسهل الفهم.",
		images: [
			`${
				process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com"
			}/images/cover.png`,
		],
		creator: "@mohammedsubuh", // ضع اسم حساب تويتر الخاص بك إن وجد
	},
	keywords: [
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
		"الأستاذ محمد صبح",
		"موقع محمد صبح",
		"دروس الفيزياء محمد صبح",
		"موقع الأستاذ محمد صبح",
		"تعليم الفيزياء",
		"فيزياء الصفوف المدرسية",
		"فيزياء لجميع المراحل الدراسية",
		"دروس الفيزياء",
		"أفضل موقع فيزياء",
	],
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
