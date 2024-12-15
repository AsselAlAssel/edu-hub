import { getLandingData } from "@/actions/landing";
import Landing from "@/scenes/Landing";
import { Metadata } from "next";

// can we stop cash here and go to the next one

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
	description:
		"استكشف أفضل شروحات الفيزياء لجميع الصفوف من إعداد الأستاذ محمد صبح (Mohammed Subuh). موقع متخصص لدعم الطلاب بفهم الفيزياء بأسلوب بسيط وسهل.",
	openGraph: {
		title: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
		description:
			"أفضل موقع يحتوي على شروحات الفيزياء لجميع المراحل الدراسية. موقع الأستاذ محمد صبح لتعليم الفيزياء بأسلوب مبتكر.",
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
				alt: "شروحات الفيزياء - محمد صبح",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
		description:
			"أفضل موقع لشروحات الفيزياء من إعداد الأستاذ محمد صبح. تعلم الفيزياء بأسلوب مبتكر وسهل الفهم.",
		images: [
			`${
				process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com"
			}/images/cover.png`,
		],
		creator: "@mohammedsubuh", // ضع اسم حساب تويتر إذا كان لديك
	},
	keywords: [
		"شروحات الفيزياء",
		"محمد صبح",
		"Mohammed Subuh",
		"تعليم الفيزياء",
		"فيزياء الصفوف المدرسية",
		"شرح الفيزياء بأسلوب بسيط",
		"دروس الفيزياء للمراحل الدراسية",
		"أفضل موقع للفيزياء",
	],
};

export default async function LandingPage() {
	const data = await getLandingData();
	return <Landing data={data} />;
}
