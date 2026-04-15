import PageContainer from "@/components/PageContainer";
import { Stack, Typography } from "@mui/material";
import { LandingPage } from "@prisma/client";
import { Metadata } from "next";
import React from "react";
import UserInformation from "./components/UserInformation";
import LandingControls from "./components/LandingControls";

export const metadata: Metadata = {
	title: "Profiler Page",
	description: "Profiler Page",
};

export default function ProfilerPage(props: {
	landingData: LandingPage | null;
}) {
	return (
		<PageContainer
			sx={{
				mb: 10,
			}}
		>
			<Typography
				variant='h4'
				sx={{
					fontWeight: 700,
					mb: 4,
					mt: 2,
				}}
			>
				لوحة التحكم
			</Typography>
			<Stack
				spacing={4}
				direction={{
					xs: "column",
					md: "row",
				}}
			>
				<UserInformation />
				<LandingControls landingData={props.landingData} />
			</Stack>
		</PageContainer>
	);
}
