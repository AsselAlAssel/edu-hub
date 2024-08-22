import { getLandingData } from "@/actions/landing";
import Landing from "@/scenes/Landing";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "الصفحة الرئيسية",
	description: "الصفحة الرئيسية",
};
export default async function LandingPage() {
	const data = await getLandingData();
	return <Landing data={data} />;
}
