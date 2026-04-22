import PageContainer from "@/components/PageContainer";
import { Stack, Typography } from "@mui/material";
import { LandingPage } from "@prisma/client";
import React from "react";
import UserInformation from "./components/UserInformation";
import LandingControls from "./components/LandingControls";

export default function ProfilerPage(props: {
	landingData: LandingPage | null;
}) {
	return (
		<PageContainer sx={{ mb: 10 }}>
			<Typography
				variant='h4'
				sx={{
					fontWeight: 800,
					mb: 5,
					mt: 2,
					letterSpacing: "-0.01em",
					color: "text.primary",
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
