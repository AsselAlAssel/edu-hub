"use client";
import PageContainer from "@/components/PageContainer";
import IconTile from "@/components/ui/IconTile";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Eyebrow } from "@/components/ui/Section";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";

const HIGHLIGHTS = [
	{
		icon: <AutoStoriesOutlinedIcon />,
		tone: "primary",
		title: "محتوى شامل",
		description: "دروس مرتبة ومنظمة تغطي المواضيع المطلوبة في كل صف.",
	},
	{
		icon: <SupportAgentOutlinedIcon />,
		tone: "secondary",
		title: "دعم مستمر",
		description: "تواصل مباشر مع الأستاذ للإجابة على أسئلتك.",
	},
	{
		icon: <VerifiedOutlinedIcon />,
		tone: "success",
		title: "شرح مبسّط وواضح",
		description: "فيديوهات تركّز على الفهم قبل الحفظ.",
	},
] as const;

export default function AboutSection({
	aboutTitle,
	aboutSubtitle,
	aboutImage,
}: {
	aboutTitle?: string;
	aboutSubtitle?: string | null;
	aboutImage?: string | null;
}) {
	return (
		<Box
			component='section'
			id='about'
			aria-labelledby='about-title'
			sx={(theme) => ({
				position: "relative",
				overflow: "hidden",
				py: { xs: 9, md: 14 },
				backgroundColor: alpha(
					theme.tokens.colors.surfaceSecondary,
					theme.palette.mode === "dark" ? 0.45 : 1
				),
				borderBlock: `1px solid ${theme.tokens.colors.border}`,
				backgroundImage: `radial-gradient(40% 60% at 90% 20%, ${alpha(theme.tokens.colors.violet, 0.12)}, transparent 70%)`,
			})}
		>
			<PageContainer>
				<Box
					sx={{
						display: "grid",
						gap: { xs: 6, md: 10 },
						alignItems: "center",
						gridTemplateColumns: {
							xs: "1fr",
							md: aboutImage ? "1.1fr 0.9fr" : "1fr",
						},
					}}
				>
					<Stack spacing={3.5}>
						<Reveal>
							<Stack spacing={2}>
								<Eyebrow>عن المنصة</Eyebrow>
								<Typography
									variant='h2'
									id='about-title'
									sx={{
										fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
										textWrap: "balance",
									}}
								>
									{aboutTitle || "عن هذه المنصة"}
								</Typography>
								{aboutSubtitle ? (
									<Typography
										variant='body1'
										sx={{
											color: "text.secondary",
											whiteSpace: "pre-line",
											fontSize: { md: "1.125rem" },
										}}
									>
										{aboutSubtitle}
									</Typography>
								) : null}
							</Stack>
						</Reveal>

						<Stagger>
							<Stack
								component='ul'
								spacing={1.5}
								sx={{ listStyle: "none", m: 0, p: 0 }}
							>
								{HIGHLIGHTS.map((item) => (
									<StaggerItem as='li' key={item.title}>
										<Stack
											direction='row'
											gap={2}
											alignItems='flex-start'
											sx={(theme) => ({
												p: 2,
												borderRadius: `${theme.tokens.radii.lg}px`,
												border: "1px solid transparent",
												transition: theme.transitions.create([
													"background-color",
													"border-color",
												]),
												"&:hover": {
													backgroundColor: alpha(
														theme.tokens.colors.surface,
														0.7
													),
													borderColor: theme.tokens.colors.border,
												},
											})}
										>
											<IconTile tone={item.tone} size={46}>
												{item.icon}
											</IconTile>
											<Box>
												<Typography variant='h6' component='h3'>
													{item.title}
												</Typography>
												<Typography
													variant='body2'
													sx={{ color: "text.secondary" }}
												>
													{item.description}
												</Typography>
											</Box>
										</Stack>
									</StaggerItem>
								))}
							</Stack>
						</Stagger>
					</Stack>

					{aboutImage ? (
						<Reveal delay={0.15}>
							<Box sx={{ position: "relative", p: { xs: 1.5, md: 2 } }}>
								{/* Offset glow frame behind the photo. */}
								<Box
									aria-hidden
									sx={(theme) => ({
										position: "absolute",
										inset: 0,
										borderRadius: `${theme.tokens.radii.xl + 8}px`,
										border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.35)}`,
										background: `linear-gradient(135deg, ${alpha(theme.tokens.colors.cyan, 0.16)}, transparent 50%, ${alpha(theme.tokens.colors.violet, 0.16)})`,
										transform: "rotate(-2.5deg)",
									})}
								/>
								<Box
									sx={(theme) => ({
										position: "relative",
										aspectRatio: "4 / 3",
										borderRadius: `${theme.tokens.radii.xl}px`,
										overflow: "hidden",
										border: `1px solid ${theme.tokens.colors.border}`,
										boxShadow: theme.tokens.shadows.strong,
										backgroundColor: theme.tokens.colors.surface,
									})}
								>
									<Image
										src={aboutImage}
										alt='صورة تعريفية بمنصة محمد صبح للفيزياء'
										fill
										sizes='(max-width: 900px) 92vw, 520px'
										style={{ objectFit: "cover" }}
									/>
								</Box>
							</Box>
						</Reveal>
					) : null}
				</Box>
			</PageContainer>
		</Box>
	);
}
