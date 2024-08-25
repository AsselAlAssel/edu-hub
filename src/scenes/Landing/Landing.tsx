import PageContainer from "@/components/PageContainer";
import { Box } from "@mui/material";
import AboutSection from "./components/AboutSection";
import Header from "./components/Header";
import ContactUs from "./components/ContactUs";
import { LandingPage } from "@prisma/client";

export default async function Landing({ data }: { data: LandingPage | null }) {
	return (
		<Box id='home'>
			<Header
				headerTitle={data?.headerTitle}
				headerSubtitle={data?.headerSubtitle}
				headerImage={data?.headerImage}
				isVideoExist={!!data?.landingVideo}
			/>

			<PageContainer
				sx={{
					minHeight: "auto !important",
					mb: 15,
				}}
			>
				{data?.landingVideo && (
					<Box
						sx={{
							width: "100%",
							height: {
								xs: "400px",
								sm: "500px",
								md: "600px",
								lg: "700px",
							},
							pt: 11,
							alignSelf: "center",
						}}
						id='video'
					>
						<iframe
							style={{
								objectFit: "cover",
								width: "100%",
								height: "100%",
							}}
							src={`https://www.youtube.com/embed/${data.landingVideoId}`}
							title='YouTube video player'
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
							referrerPolicy='strict-origin-when-cross-origin'
							allowFullScreen
						></iframe>
					</Box>
				)}
				<AboutSection
					aboutTitle={data?.aboutTitle}
					aboutSubtitle={data?.aboutSubtitle}
					aboutImage={data?.aboutImage}
				/>
			</PageContainer>
			<ContactUs
				whatsappNumber={data?.whatsAppNumber}
				address={data?.address}
				email={data?.email}
			/>
		</Box>
	);
}
