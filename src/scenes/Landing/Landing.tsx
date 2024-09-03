import { Box } from "@mui/material";
import { LandingPage } from "@prisma/client";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";

export default async function Landing({ data }: { data: LandingPage | null }) {
	return (
		<Box
			id='home'
			sx={{
				mt: -5,
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
					sx={{
						maxWidth: "1100px",
						width: "100%",
						margin: "auto",
						height: {
							xs: "400px",
							sm: "500px",
							md: "600px",
							lg: "700px",
						},
						py: 10,
						alignSelf: "center",
					}}
					id='video'
				>
					<iframe
						style={{
							objectFit: "cover",
							width: "100%",
							height: "100%",
							borderRadius: "10px",
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
			<ContactUs
				whatsappNumber={data?.whatsAppNumber}
				address={data?.address}
				email={data?.email}
			/>
		</Box>
	);
}
