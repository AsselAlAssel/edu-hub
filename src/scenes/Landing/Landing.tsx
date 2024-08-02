// import { Box, Stack } from "@mui/material";
// import crypto from "crypto";
// import queryString from "query-string";
// import Header from "./components/Header";
// import PageContainer from "@/components/PageContainer";
// import Image from "next/image";
// import AboutSection from "./components/AboutSection";
import PageContainer from "@/components/PageContainer";
import { Box } from "@mui/material";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";

export default async function Landing() {
	// <iframe
	// 			width={800}
	// 			height={500}
	// 			src={url2}
	// 			// src="https://iframe.mediadelivery.net/embed/277191/e5fc5f49-efb1-4fa7-9f53-5a4f8ba22884?token=1f6e33bc23ab7f1575cba34d5796377a0c88206c1a4cf30144eb359c428e6aed&expires=1722527359&autoplay=true&loop=false&muted=false&preload=true&responsive=true"
	// 			loading="lazy"
	// 			allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
	// 			allowFullScreen={true}
	// 		></iframe>
	return (
		<Box
		// sx={{
		// 	mt: -5,
		// }}
		>
			<Header />
			<PageContainer
				sx={{
					mt: 10,
				}}
			>
				<video
					controls
					autoPlay={true}
					loop
					playsInline
					muted
					style={{
						objectFit: "cover",
						width: "100%",
						height: "100%",
					}}
					controlsList='nodownload'
					id='video'
				>
					<source src={`/videos/landing-video.mp4`} type='video/mp4'></source>
				</video>
				<AboutSection />
			</PageContainer>

			{/*
		<PageContainer
		  sx={{
			maxWidth: "1440px !important",
		  }}
		>
		  <KeyPainPoints />
		  <Features />
		  <HowUseSystem />
		</PageContainer>
  
		<ContactUs />
		<Footer /> */}
		</Box>
	);
}
