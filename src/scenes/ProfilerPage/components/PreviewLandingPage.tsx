"use client";
import AboutSection from "@/scenes/Landing/components/AboutSection";
import ContactUs from "@/scenes/Landing/components/ContactUs";
import FeaturesSection from "@/scenes/Landing/components/FeaturesSection";
import Hero from "@/scenes/Landing/components/Header";
import VideoSection from "@/scenes/Landing/components/VideoSection";
import { getYouTubeVideoID } from "@/libs/constant";
import { Box, Typography } from "@mui/material";
import type { LandingFormValues } from "./LandingControls";

/** Renders the real landing sections with unsaved form values, in a framed viewport. */
export default function PreviewLandingPage({
	data,
}: {
	data: LandingFormValues;
}) {
	const videoId = data.landingVideo
		? getYouTubeVideoID(data.landingVideo)
		: null;

	return (
		<Box>
			<Typography variant='body2' sx={{ color: "text.secondary", mb: 1.5 }}>
				معاينة للتغييرات الحالية — لن تظهر للزوار قبل الحفظ.
			</Typography>
			<Box
				aria-label='معاينة الصفحة الرئيسية'
				role='region'
				sx={(theme) => ({
					maxHeight: "75vh",
					overflow: "auto",
					borderRadius: `${theme.tokens.radii.lg}px`,
					border: `1px solid ${theme.tokens.colors.border}`,
					backgroundColor: theme.tokens.colors.bg,
					// Anchors inside the preview must not steal page navigation.
					"& section[id]": { scrollMarginTop: 0 },
				})}
			>
				<Hero
					preview
					headerTitle={data.headerTitle}
					headerSubtitle={data.headerSubtitle}
					headerImage={data.headerImage}
				/>
				<FeaturesSection />
				{videoId ? <VideoSection videoId={videoId} /> : null}
				<AboutSection
					aboutTitle={data.aboutTitle}
					aboutSubtitle={data.aboutSubtitle}
					aboutImage={data.aboutImage}
				/>
				<ContactUs
					whatsappNumber={data.whatsAppNumber}
					address={data.address}
					email={data.email}
				/>
			</Box>
		</Box>
	);
}
