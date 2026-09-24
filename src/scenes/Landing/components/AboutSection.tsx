"use client";
import PageContainer from "@/components/PageContainer";
import IconTile from "@/components/ui/IconTile";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Stack, Typography } from "@mui/material";
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
				py: { xs: 8, md: 12 },
				backgroundColor: theme.tokens.colors.surfaceSecondary,
				borderBlock: `1px solid ${theme.tokens.colors.border}`,
			})}
		>
			<PageContainer>
				<Box
					sx={{
						display: "grid",
						gap: { xs: 5, md: 8 },
						alignItems: "center",
						gridTemplateColumns: {
							xs: "1fr",
							md: aboutImage ? "0.9fr 1.1fr" : "1fr",
						},
					}}
				>
					{aboutImage ? (
						<Box
							sx={(theme) => ({
								position: "relative",
								aspectRatio: "4 / 3",
								borderRadius: `${theme.tokens.radii.xl}px`,
								overflow: "hidden",
								border: `1px solid ${theme.tokens.colors.border}`,
								boxShadow: theme.tokens.shadows.medium,
								backgroundColor: theme.tokens.colors.surface,
							})}
						>
							<Image
								src={aboutImage}
								alt='صورة تعريفية بمنصة محمد صبح للفيزياء'
								fill
								sizes='(max-width: 900px) 92vw, 540px'
								style={{ objectFit: "cover" }}
							/>
						</Box>
					) : null}

					<Stack spacing={3}>
						<Box>
							<Typography
								variant='overline'
								component='p'
								sx={{ color: "primary.main", mb: 1 }}
							>
								عن المنصة
							</Typography>
							<Typography variant='h2' id='about-title'>
								{aboutTitle || "عن هذه المنصة"}
							</Typography>
						</Box>
						{aboutSubtitle ? (
							<Typography
								variant='body1'
								sx={{
									color: "text.secondary",
									whiteSpace: "pre-line",
									fontSize: { md: "1.0625rem" },
								}}
							>
								{aboutSubtitle}
							</Typography>
						) : null}

						<Stack
							component='ul'
							spacing={2}
							sx={{ listStyle: "none", m: 0, p: 0, pt: 1 }}
						>
							{HIGHLIGHTS.map((item) => (
								<Stack
									component='li'
									key={item.title}
									direction='row'
									gap={2}
									alignItems='flex-start'
								>
									<IconTile tone={item.tone} size={44}>
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
							))}
						</Stack>
					</Stack>
				</Box>
			</PageContainer>
		</Box>
	);
}
