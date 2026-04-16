"use client";

import { Box } from "@mui/material";
import { LandingPage } from "@prisma/client";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";
import {
	AnimatedSection,
	MotionBox,
	scaleIn,
} from "./components/MotionComponents";

export default function Landing({ data }: { data: LandingPage | null }) {
	return (
		<Box
			id='home'
			sx={{
				mt: "calc(-104px + 72px)",
			}}
		>
			<Header
				headerTitle={data?.headerTitle}
				headerSubtitle={data?.headerSubtitle}
				headerImage={data?.headerImage}
				isVideoExist={!!data?.landingVideo}
			/>

			{data?.landingVideo && (
				<Box
					id='video'
					sx={{
						backgroundColor: "#FFFFFF",
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: 1,
							backgroundColor: "#EAECF0",
						},
					}}
				>
					<Box
						sx={{
							maxWidth: 1200,
							mx: "auto",
							px: { xs: 3, sm: 4, md: 6 },
							py: { xs: 8, md: 12 },
						}}
					>
						<AnimatedSection variants={scaleIn}>
							<MotionBox
								whileHover={{ scale: 1.015 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								sx={{
									position: "relative",
									maxWidth: 900,
									mx: "auto",
									borderRadius: "20px",
									overflow: "hidden",
									boxShadow:
										"0 24px 64px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)",
									border: "1px solid rgba(0,0,0,0.06)",
									aspectRatio: "16 / 9",
									"&:hover": {
										boxShadow:
											"0 32px 80px rgba(0,0,0,0.14), 0 12px 32px rgba(0,0,0,0.08)",
									},
									transition: "box-shadow 0.4s ease",
								}}
							>
								<iframe
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										border: "none",
									}}
									src={`https://www.youtube.com/embed/${data.landingVideoId}`}
									title='YouTube video player'
									frameBorder='0'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
									referrerPolicy='strict-origin-when-cross-origin'
									allowFullScreen
								/>
							</MotionBox>
						</AnimatedSection>
					</Box>
				</Box>
			)}

			<AboutSection
				aboutTitle={data?.aboutTitle}
				aboutSubtitle={data?.aboutSubtitle}
				aboutImage={data?.aboutImage}
			/>
			<ContactUs
				whatsappNumber={data?.whatsAppNumber}
				address={data?.address}
				email={data?.email}
			/>
		</Box>
	);
}
