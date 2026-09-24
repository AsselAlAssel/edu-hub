import { getLandingData } from "@/actions/landing";
import { authOptions } from "@/libs/auth";
import ProfilerPage from "@/scenes/ProfilerPage";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "لوحة التحكم",
	robots: { index: false, follow: false },
};

export default async function Page() {
	// Middleware already gates /admin; this is defence in depth.
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "ADMIN") redirect("/auth/signin");

	const data = await getLandingData();
	return <ProfilerPage landingData={data} />;
}
