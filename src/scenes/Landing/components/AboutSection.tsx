"use client";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { alpha, Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import {
	SectionContainer,
	SectionLabel,
	SectionStack,
	SectionTitle,
} from "./Styled";
import {
	AnimatedSection,
	MotionBox,
	StaggerGroup,
	StaggerItem,
} from "./MotionComponents";

const features = [
	{
		icon: AutoStoriesOutlinedIcon,
		title: "محتوى شامل",
		description: "دروس مرتبة ومنظمة تغطي جميع المواضيع المطلوبة",
	},
	{
		icon: GroupsOutlinedIcon,
		title: "دعم مستمر",
		description: "تواصل مباشر مع الأستاذ للإجابة على أسئلتك",
	},
	{
		icon: VerifiedOutlinedIcon,
		title: "جودة عالية",
		description: "فيديوهات عالية الجودة مع شرح مبسط وواضح",
	},
];

export default function AboutSection(props: {
	aboutTitle?: string;
	aboutSubtitle?: string | null;
	aboutImage?: string | null;
}) {
	const { aboutTitle, aboutSubtitle, aboutImage } = props;

	return (
		<Box
			id='about'
			sx={{
				backgroundColor: "#F8FAFC",
				position: "relative",
				overflow: "hidden",
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
			<SectionContainer sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
				<SectionStack>
					<AnimatedSection
						viewportAmount={0.3}
						viewportMargin='0px'
						sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
					>
						<SectionLabel>عن المنصة</SectionLabel>
						<SectionTitle>{aboutTitle}</SectionTitle>
						{aboutSubtitle && (
							<Typography
								sx={{
									fontSize: { xs: "1rem", sm: "1.125rem" },
									lineHeight: 1.75,
									color: "text.tertiary",
									maxWidth: 640,
									mx: "auto",
									mt: 2,
								}}
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
								viewportAmount={0.2}
								viewportMargin='0px'
								sx={{
									flex: 1,
									maxWidth: { xs: "100%", md: "45%" },
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Box
									sx={{
										position: "relative",
										borderRadius: "20px",
										overflow: "hidden",
										boxShadow:
											"0 20px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)",
										border: "1px solid",
										borderColor: alpha("#000", 0.06),
										maxWidth: 440,
										width: "100%",
									}}
								>
									<Image
										src={aboutImage}
										alt='About'
										layout='responsive'
										width={440}
										height={340}
										style={{
											objectFit: "cover",
											width: "100%",
											height: "auto",
										}}
									/>
								</Box>
							</AnimatedSection>
						)}

						<StaggerGroup
							viewportAmount={0.15}
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
								<StaggerItem key={feature.title}>
									<MotionBox
										whileHover={{ scale: 1.03, y: -3 }}
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
									>
										<Stack
											direction='row'
											spacing={2.5}
											sx={{
												p: 3,
												borderRadius: "16px",
												backgroundColor: "#FFFFFF",
												border: "1px solid",
												borderColor: "#EAECF0",
												boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
												transition:
													"border-color 0.3s ease, box-shadow 0.3s ease",
												"&:hover": {
													borderColor: alpha("#0088DD", 0.3),
													boxShadow: "0 8px 30px rgba(0, 136, 221, 0.12)",
												},
											}}
											alignItems='flex-start'
										>
											<Box
												sx={{
													width: 48,
													height: 48,
													borderRadius: "12px",
													backgroundColor: alpha("#0088DD", 0.08),
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													flexShrink: 0,
												}}
											>
												<feature.icon
													sx={{ color: "primary.main", fontSize: 24 }}
												/>
											</Box>
											<Box>
												<Typography
													sx={{
														fontWeight: 700,
														fontSize: "1rem",
														color: "text.primary",
														mb: 0.5,
													}}
												>
													{feature.title}
												</Typography>
												<Typography
													sx={{
														fontSize: "0.9375rem",
														lineHeight: 1.65,
														color: "text.tertiary",
													}}
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
