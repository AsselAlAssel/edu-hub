"use client";

import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { LandingPage } from "@prisma/client";
import { useMemo, useState } from "react";

import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";
import { landingChrome } from "./landingChrome";
import {
	SectionContainer,
	SectionLabel,
	SectionStack,
	SectionTitle,
	SectionSubtitle,
} from "./components/Styled";
import {
	AnimatedSection,
	GlowOrb,
	MotionBox,
	scaleIn,
	StaggerGroup,
	StaggerItem,
} from "./components/MotionComponents";

export default function Landing({ data }: { data: LandingPage | null }) {
	const [videoLoaded, setVideoLoaded] = useState(false);
	const theme = useTheme();
	const features = useMemo(
		() => [
			{
				icon: AutoStoriesOutlinedIcon,
				title: "محتوى شامل ومنظم",
				description: "دروس مرتبة تغطي كل المواضيع مع أمثلة عملية وتمارين تفاعلية",
				gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.75)})`,
			},
			{
				icon: OndemandVideoOutlinedIcon,
				title: "فيديوهات عالية الجودة",
				description: "شروحات مصورة بجودة عالية مع رسومات توضيحية لتسهيل الفهم",
				gradient: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${alpha(theme.palette.secondary.light, 0.95)})`,
			},
			{
				icon: SchoolOutlinedIcon,
				title: "دعم مباشر من الأستاذ",
				description: "تواصل مستمر للإجابة على أسئلتك وحل مشاكلك الدراسية",
				gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
			},
			{
				icon: TrendingUpOutlinedIcon,
				title: "تتبع تقدمك",
				description: "متابعة مستمرة لأدائك مع تقارير وإحصائيات تساعدك على التحسن",
				gradient: "linear-gradient(135deg, #10B981, #34D399)",
			},
		],
		[theme],
	);

	return (
		<>
			<Box
				id='home'
				sx={(t) => ({
					mt: "calc(-104px + 72px)",
					backgroundColor: landingChrome(t).bg,
				})}
			>
				{/* ─── Hero ──────────────────────────────────────────── */}
				<Header
					headerTitle={data?.headerTitle}
					headerSubtitle={data?.headerSubtitle}
					headerImage={data?.headerImage}
					isVideoExist={!!data?.landingVideo}
				/>

				{/* ─── Features ──────────────────────────────────────── */}
				<Box
					sx={(t) => ({
						backgroundColor: landingChrome(t).bg,
						position: "relative",
						overflow: "hidden",
					})}
				>
					<GlowOrb
						color='rgba(124,58,237,0.12)'
						size={500}
						top='20%'
						right='-10%'
						delay={2}
					/>

					<SectionContainer sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
						<SectionStack>
							<AnimatedSection
								viewportAmount={0.2}
								viewportMargin='0px'
								sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
							>
								<SectionLabel>لماذا نحن</SectionLabel>
								<SectionTitle>كل ما تحتاجه في مكان واحد</SectionTitle>
								<SectionSubtitle>
									أدوات ومميزات صُممت خصيصاً لمساعدتك في رحلتك التعليمية
								</SectionSubtitle>
							</AnimatedSection>

							<StaggerGroup
								viewportAmount={0.1}
								viewportMargin='0px'
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr",
										sm: "1fr 1fr",
										md: "1fr 1fr 1fr 1fr",
									},
									gap: 3,
								}}
							>
								{features.map((feature) => (
									<StaggerItem key={feature.title}>
										<MotionBox
											whileHover={{ y: -6, scale: 1.02 }}
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 20,
											}}
										>
											<Stack
												spacing={2.5}
												sx={(t) => {
													const c = landingChrome(t);
													return {
														p: 3.5,
														borderRadius: "20px",
														backgroundColor: alpha(t.palette.background.paper, 0.55),
														backdropFilter: "blur(16px)",
														border: `1px solid ${c.border}`,
														boxShadow: c.cardShadow,
														height: "100%",
														transition:
															"border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.35s ease",
														"&:hover": {
															borderColor: c.borderHover,
															boxShadow: c.cardShadowHover,
														},
													};
												}}
											>
												<Box
													sx={{
														width: 52,
														height: 52,
														borderRadius: "14px",
														background: feature.gradient,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														boxShadow: `0 4px 16px rgba(0,0,0,0.3)`,
													}}
												>
													<feature.icon
													sx={(t) => ({
														color: t.palette.primary.contrastText,
														fontSize: 26,
													})}
												/>
												</Box>
												<Typography
													sx={(t) => ({
														fontWeight: 700,
														fontSize: "1.0625rem",
														color: t.palette.text.primary,
													})}
												>
													{feature.title}
												</Typography>
												<Typography
													sx={(t) => ({
														fontSize: "0.9375rem",
														lineHeight: 1.7,
														color: landingChrome(t).textSecondary,
													})}
												>
													{feature.description}
												</Typography>
											</Stack>
										</MotionBox>
									</StaggerItem>
								))}
							</StaggerGroup>
						</SectionStack>
					</SectionContainer>
				</Box>

				{/* ─── Video ─────────────────────────────────────────── */}
				{data?.landingVideo && (
					<Box
						id='video'
						sx={(t) => {
							const c = landingChrome(t);
							return {
								backgroundColor: c.surface,
								position: "relative",
								overflow: "hidden",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: 1,
									background: `linear-gradient(90deg, transparent 0%, ${c.border} 50%, transparent 100%)`,
								},
							};
						}}
					>
						<GlowOrb
							color='rgba(0,180,216,0.15)'
							size={500}
							top='-20%'
							left='30%'
						/>

						<Box
							sx={{
								maxWidth: 1200,
								mx: "auto",
								px: { xs: 3, sm: 4, md: 6 },
								py: { xs: 8, md: 12 },
							}}
						>
							<AnimatedSection
								variants={scaleIn}
								viewportAmount={0.2}
								viewportMargin='0px'
							>
								<MotionBox
									whileHover={{ scale: 1.01 }}
									transition={{ type: "spring", stiffness: 300, damping: 25 }}
									sx={(t) => {
										const c = landingChrome(t);
										return {
											position: "relative",
											maxWidth: 920,
											mx: "auto",
											borderRadius: "24px",
											overflow: "hidden",
											border: `1px solid ${c.border}`,
											boxShadow: `0 24px 80px rgba(0,0,0,0.5), ${c.glow}`,
											aspectRatio: "16 / 9",
											"&:hover": {
												boxShadow: `0 32px 100px rgba(0,0,0,0.6), ${c.glowStrong}`,
												borderColor: c.borderHover,
											},
											transition: "box-shadow 0.4s ease, border-color 0.4s ease",
										};
									}}
								>
									{videoLoaded ? (
										<iframe
											style={{
												position: "absolute",
												top: 0,
												left: 0,
												width: "100%",
												height: "100%",
												border: "none",
											}}
											src={`https://www.youtube.com/embed/${data.landingVideoId}?autoplay=1`}
											title='YouTube video player'
											frameBorder='0'
											allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
											referrerPolicy='strict-origin-when-cross-origin'
											allowFullScreen
										/>
									) : (
										<Box
											onClick={() => setVideoLoaded(true)}
											sx={{
												position: "absolute",
												inset: 0,
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												backgroundImage: `url(https://img.youtube.com/vi/${data.landingVideoId}/maxresdefault.jpg)`,
												backgroundSize: "cover",
												backgroundPosition: "center",
												"&:hover .play-btn": {
													transform: "scale(1.1)",
													boxShadow: "0 0 40px rgba(0,180,216,0.4)",
												},
											}}
										>
											<Box
												className='play-btn'
												sx={{
													width: 72,
													height: 72,
													borderRadius: "50%",
													backgroundColor: "rgba(0,0,0,0.7)",
													backdropFilter: "blur(8px)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													transition: "all 0.3s ease",
													boxShadow: "0 0 24px rgba(0,0,0,0.4)",
												}}
											>
												<Box
													sx={{
														width: 0,
														height: 0,
														borderTop: "14px solid transparent",
														borderBottom: "14px solid transparent",
														borderLeft: "22px solid #fff",
														ml: "4px",
													}}
												/>
											</Box>
										</Box>
									)}
								</MotionBox>
							</AnimatedSection>
						</Box>
					</Box>
				)}

				{/* ─── About ─────────────────────────────────────────── */}
				<AboutSection
					aboutTitle={data?.aboutTitle}
					aboutSubtitle={data?.aboutSubtitle}
					aboutImage={data?.aboutImage}
				/>

				{/* ─── Contact ───────────────────────────────────────── */}
				<ContactUs
					whatsappNumber={data?.whatsAppNumber}
					address={data?.address}
					email={data?.email}
				/>
			</Box>
		</>
	);
}
