import { Box, Typography } from "@mui/material";
import { LandingPage } from "@prisma/client";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";

export default async function Landing({ data }: { data: LandingPage | null }) {
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
						<Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
							<Typography
								sx={{
									fontSize: "0.875rem",
									fontWeight: 700,
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									color: "primary.main",
									mb: 1.5,
								}}
							>
								شاهد الآن
							</Typography>
							<Typography
								sx={{
									fontSize: { xs: "1.625rem", md: "2.5rem" },
									fontWeight: 800,
									lineHeight: 1.2,
									letterSpacing: "-0.02em",
									color: "text.primary",
								}}
							>
								تعرف على طريقة التعلم
							</Typography>
							<Typography
								sx={{
									fontSize: { xs: "1rem", sm: "1.125rem" },
									lineHeight: 1.7,
									color: "text.tertiary",
									maxWidth: 520,
									mx: "auto",
									mt: 2,
								}}
							>
								شاهد الفيديو التعريفي لمعرفة كيف تبدأ رحلتك التعليمية
							</Typography>
						</Box>

						<Box
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
						</Box>
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
