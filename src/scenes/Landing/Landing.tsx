import PageContainer from "@/components/PageContainer";
import { Box } from "@mui/material";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";

export default async function Landing() {
	return (
		<Box>
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
		</Box>
	);
}
