import { getLandingData } from "@/actions/landing";
import Landing from "@/scenes/Landing";
import { Metadata } from "next";

// can we stop cash here and go to the next one

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "الصفحة الرئيسية",
	description: "الصفحة الرئيسية",
	openGraph: {
		title: "الصفحة الرئيسية",
		description: "الصفحة الرئيسية",
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
export default async function LandingPage() {
	const data = await getLandingData();
	return <Landing data={data} />;
}
