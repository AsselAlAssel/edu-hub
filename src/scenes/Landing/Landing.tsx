"use client";

import { Box, Stack, Typography } from "@mui/material";
import { LandingPage } from "@prisma/client";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";
import {
	DARK,
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

const features = [
	{
		icon: AutoStoriesOutlinedIcon,
		title: "محتوى شامل ومنظم",
		description: "دروس مرتبة تغطي كل المواضيع مع أمثلة عملية وتمارين تفاعلية",
		gradient: `linear-gradient(135deg, ${DARK.accent}, #38BDF8)`,
	},
	{
		icon: OndemandVideoOutlinedIcon,
		title: "فيديوهات عالية الجودة",
		description: "شروحات مصورة بجودة عالية مع رسومات توضيحية لتسهيل الفهم",
		gradient: `linear-gradient(135deg, ${DARK.purple}, #A78BFA)`,
	},
	{
		icon: SchoolOutlinedIcon,
		title: "دعم مباشر من الأستاذ",
		description: "تواصل مستمر للإجابة على أسئلتك وحل مشاكلك الدراسية",
		gradient: `linear-gradient(135deg, #F59E0B, #FBBF24)`,
	},
	{
		icon: TrendingUpOutlinedIcon,
		title: "تتبع تقدمك",
		description: "متابعة مستمرة لأدائك مع تقارير وإحصائيات تساعدك على التحسن",
		gradient: `linear-gradient(135deg, #10B981, #34D399)`,
	},
];

export default function Landing({ data }: { data: LandingPage | null }) {
	return (
		<Box
			id='home'
			sx={{
				mt: "calc(-104px + 72px)",
				backgroundColor: DARK.bg,
			}}
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
				sx={{
					backgroundColor: DARK.bg,
					position: "relative",
					overflow: "hidden",
				}}
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
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
									>
										<Stack
											spacing={2.5}
											sx={{
												p: 3.5,
												borderRadius: "20px",
												backgroundColor: "rgba(10,17,40,0.6)",
												backdropFilter: "blur(16px)",
												border: `1px solid ${DARK.border}`,
												boxShadow: DARK.cardShadow,
												height: "100%",
												transition:
													"border-color 0.4s ease, box-shadow 0.4s ease",
												"&:hover": {
													borderColor: DARK.borderHover,
													boxShadow: DARK.cardShadowHover,
												},
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
												<feature.icon sx={{ color: "#fff", fontSize: 26 }} />
											</Box>
											<Typography
												sx={{
													fontWeight: 700,
													fontSize: "1.0625rem",
													color: DARK.text,
												}}
											>
												{feature.title}
											</Typography>
											<Typography
												sx={{
													fontSize: "0.9375rem",
													lineHeight: 1.7,
													color: DARK.textSecondary,
												}}
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
					sx={{
						backgroundColor: DARK.surface,
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: 1,
							background: `linear-gradient(90deg, transparent 0%, ${DARK.border} 50%, transparent 100%)`,
						},
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
								sx={{
									position: "relative",
									maxWidth: 920,
									mx: "auto",
									borderRadius: "24px",
									overflow: "hidden",
									border: `1px solid ${DARK.border}`,
									boxShadow: `0 24px 80px rgba(0,0,0,0.5), ${DARK.glow}`,
									aspectRatio: "16 / 9",
									"&:hover": {
										boxShadow: `0 32px 100px rgba(0,0,0,0.6), ${DARK.glowStrong}`,
										borderColor: DARK.borderHover,
									},
									transition: "box-shadow 0.4s ease, border-color 0.4s ease",
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
	);
}
