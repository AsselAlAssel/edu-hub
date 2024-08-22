import { getLandingData } from "@/actions/landing";
import ProfilerPage from "@/scenes/ProfilerPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Admin Profiler",
	description: "Admin Profiler",
};

export default async function page() {
	const data = await getLandingData();
	return <ProfilerPage landingData={data} />;
}
