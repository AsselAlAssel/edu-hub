"use client";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { landingChrome } from "../landingChrome";
import {
	SectionContainer,
	SectionLabel,
	SectionStack,
	SectionTitle,
} from "./Styled";
import {
	AnimatedSection,
	GlowOrb,
	MotionBox,
	StaggerGroup,
	StaggerItem,
	fadeSlideRight,
	fadeSlideLeft,
} from "./MotionComponents";

export default function AboutSection(props: {
	aboutTitle?: string;
	aboutSubtitle?: string | null;
	aboutImage?: string | null;
}) {
	const { aboutTitle, aboutSubtitle, aboutImage } = props;
	const theme = useTheme();
	const features = useMemo(
		() => [
			{
				icon: AutoStoriesOutlinedIcon,
				title: "محتوى شامل",
				description: "دروس مرتبة ومنظمة تغطي جميع المواضيع المطلوبة",
				color: theme.palette.primary.main,
			},
			{
				icon: GroupsOutlinedIcon,
				title: "دعم مستمر",
				description: "تواصل مباشر مع الأستاذ للإجابة على أسئلتك",
				color: theme.palette.secondary.main,
			},
			{
				icon: VerifiedOutlinedIcon,
				title: "جودة عالية",
				description: "فيديوهات عالية الجودة مع شرح مبسط وواضح",
				color: theme.palette.success.main,
			},
		],
		[theme]
	);

	return (
		<Box
			id='about'
			sx={(t) => {
				const c = landingChrome(t);
				return {
					backgroundColor: c.bg,
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
				color='rgba(124,58,237,0.1)'
				size={400}
				top='10%'
				left='-5%'
				delay={1}
			/>
			<GlowOrb
				color='rgba(0,180,216,0.08)'
				size={350}
				bottom='10%'
				right='-5%'
				delay={4}
			/>

			<SectionContainer sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
				<SectionStack>
					<AnimatedSection
						viewportAmount={0.2}
						viewportMargin='0px'
						sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
					>
						<SectionLabel>عن المنصة</SectionLabel>
						<SectionTitle>{aboutTitle}</SectionTitle>
						{aboutSubtitle && (
							<Typography
								sx={(t) => ({
									fontSize: { xs: "1rem", sm: "1.125rem" },
									lineHeight: 1.75,
									color: landingChrome(t).textSecondary,
									maxWidth: 600,
									mx: "auto",
									mt: 2,
								})}
							>
								{aboutSubtitle}
							</Typography>
						)}
					</AnimatedSection>

					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={{ xs: 6, md: 8 }}
						alignItems='center'
					>
						{aboutImage && (
							<AnimatedSection
								delay={0.1}
								variants={fadeSlideRight}
								viewportAmount={0.15}
								viewportMargin='0px'
								sx={{
									flex: 1,
									maxWidth: { xs: "100%", md: "45%" },
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Box
									sx={(t) => {
										const c = landingChrome(t);
										const isDark = t.palette.mode === "dark";
										return {
											position: "relative",
											borderRadius: "24px",
											overflow: "hidden",
											border: `1px solid ${c.border}`,
											boxShadow: isDark
												? `0 12px 36px rgba(0,0,0,0.26), ${c.glow}`
												: `0 5px 18px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.04), ${c.glow}`,
											maxWidth: 440,
											width: "100%",
										};
									}}
								>
									<Image
										src={aboutImage}
										alt='About'
										width={440}
										height={340}
										sizes='(max-width: 768px) 100vw, 440px'
										style={{
											objectFit: "cover",
											width: "100%",
											height: "auto",
										}}
									/>
									<Box
										sx={(t) => ({
											position: "absolute",
											inset: 0,
											background: `linear-gradient(180deg, transparent 50%, ${alpha(t.palette.primary.main, 0.08)} 100%)`,
											pointerEvents: "none",
										})}
									/>
								</Box>
							</AnimatedSection>
						)}

						<StaggerGroup
							viewportAmount={0.1}
							viewportMargin='0px'
							sx={{
								flex: 1,
								maxWidth: { xs: "100%", md: aboutImage ? "55%" : "100%" },
								display: "flex",
								flexDirection: "column",
								gap: 3,
							}}
						>
							{features.map((feature) => (
								<StaggerItem key={feature.title} variants={fadeSlideLeft}>
									<MotionBox
										whileHover={{ scale: 1.02, x: -4 }}
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
									>
										<Stack
											direction='row'
											spacing={2.5}
											sx={(t) => {
												const c = landingChrome(t);
												return {
													p: 3,
													borderRadius: "18px",
													backgroundColor: alpha(
														t.palette.background.paper,
														0.55
													),
													backdropFilter: "blur(16px)",
													border: `1px solid ${c.border}`,
													boxShadow: c.cardShadow,
													transition:
														"border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.35s ease",
													"&:hover": {
														borderColor: c.borderHover,
														boxShadow: c.cardShadowHover,
													},
												};
											}}
											alignItems='flex-start'
										>
											<Box
												sx={{
													width: 48,
													height: 48,
													borderRadius: "14px",
													backgroundColor: `${feature.color}15`,
													border: `1px solid ${feature.color}25`,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													flexShrink: 0,
												}}
											>
												<feature.icon
													sx={{ color: feature.color, fontSize: 24 }}
												/>
											</Box>
											<Box>
												<Typography
													sx={(t) => ({
														fontWeight: 700,
														fontSize: "1rem",
														color: t.palette.text.primary,
														mb: 0.5,
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
											</Box>
										</Stack>
									</MotionBox>
								</StaggerItem>
							))}
						</StaggerGroup>
					</Stack>
				</SectionStack>
			</SectionContainer>
		</Box>
	);
}
