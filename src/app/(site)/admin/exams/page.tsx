import { authOptions } from "@/libs/auth";
import ExamsAdmin from "@/scenes/ExamsAdmin/ExamsAdmin";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "الامتحانات",
	robots: { index: false, follow: false },
};

export default async function Page() {
	// Middleware already gates /admin; this is defence in depth.
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "ADMIN") redirect("/");

	return <ExamsAdmin />;
}
