import React from "react";
import { Box } from "@mui/system";
import Header from "@/scenes/Landing/components/Header";
import PageContainer from "@/components/PageContainer";
import AboutSection from "@/scenes/Landing/components/AboutSection";
import ContactUs from "@/scenes/Landing/components/ContactUs";

export default function PreviewLandingPage({ data }: { data: any }) {
	return (
		<Box
			sx={{
				backgroundColor: "white",
			}}
		>
			<Header
				headerTitle={data?.headerTitle}
				headerSubtitle={data?.headerSubtitle}
				headerImage={data?.headerImage}
				isVideoExist={!!data?.landingVideo}
			/>

			<PageContainer>
				{data?.landingVideo && (
					<Box
						sx={{
							width: "100%",
							height: "100%",
							pt: 11,
						}}
						id='video'
					>
						<iframe
							style={{
								objectFit: "cover",
								width: "100%",
								height: "700px",
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
