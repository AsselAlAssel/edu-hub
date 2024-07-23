import { Stack } from "@mui/material";
import React from "react";
import VideoSection from "./components/VideoSection";
import AboutSection from "./components/AboutSection";

export default function Landing() {
	return (
		<Stack spacing={2}>
			<Stack
				spacing={2}
				justifyContent={"space-between"}
				direction={"row"}
				alignItems={"center"}
			>
				<AboutSection />
				<VideoSection />
			</Stack>
			{/* <Classes/> */}
		</Stack>
	);
}
