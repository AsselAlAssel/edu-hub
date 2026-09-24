"use client";
import IconTile from "@/components/ui/IconTile";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import Surface from "@/components/ui/Surface";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Only capabilities the platform actually has — no progress tracking or stats.
const FEATURES = [
	{
		icon: <AccountTreeOutlinedIcon />,
		tone: "primary",
		title: "محتوى منظّم حسب الصف",
		description:
			"دروس مرتبة في مجلدات حسب الصف والوحدة لتصل إلى ما تحتاجه بسرعة.",
	},
	{
		icon: <OndemandVideoOutlinedIcon />,
		tone: "secondary",
		title: "شروحات مصوّرة",
		description: "فيديوهات تشرح المفاهيم خطوة بخطوة، يمكنك مشاهدتها في أي وقت.",
	},
	{
		icon: <FileDownloadOutlinedIcon />,
		tone: "info",
		title: "ملفات قابلة للتحميل",
		description: "ملخصات وأوراق عمل بصيغ متعددة لتراجع دروسك حتى دون اتصال.",
	},
	{
		icon: <ForumOutlinedIcon />,
		tone: "warning",
		title: "تواصل مباشر مع الأستاذ",
		description:
			"اسأل عن أي درس عبر واتساب أو البريد الإلكتروني وستصلك الإجابة.",
	},
] as const;

export default function FeaturesSection() {
	return (
		<Section id='features' aria-labelledby='features-title'>
			<SectionHeader
				titleId='features-title'
				eyebrow='لماذا هذه المنصة'
				title={
					<>
						كل ما تحتاجه لفهم الفيزياء{" "}
						<span className='qa-gradient-text'>في مكان واحد</span>
					</>
				}
				description='أدوات بسيطة صُممت لتساعدك على التركيز في التعلّم.'
			/>
			<Stagger>
				<Box
					component='ul'
					sx={{
						listStyle: "none",
						m: 0,
						p: 0,
						display: "grid",
						gap: { xs: 2, md: 2.5 },
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, minmax(0, 1fr))",
							lg: "repeat(4, minmax(0, 1fr))",
						},
					}}
				>
					{FEATURES.map((feature, index) => (
						<StaggerItem as='li' key={feature.title}>
							<Surface
								interactive
								padding={3.5}
								sx={{
									height: "100%",
									overflow: "hidden",
									"&:hover .qa-icon-tile": { transform: "translateY(-2px)" },
									"&:hover .qa-icon-tile svg": {
										transform: "scale(1.12) rotate(-6deg)",
									},
								}}
							>
								<Typography
									aria-hidden
									className='qa-latin'
									sx={(theme) => ({
										position: "absolute",
										top: 12,
										insetInlineEnd: 18,
										fontSize: "3.5rem",
										fontWeight: 700,
										lineHeight: 1,
										color: alpha(theme.tokens.colors.textPrimary, 0.06),
										userSelect: "none",
									})}
								>
									0{index + 1}
								</Typography>
								<IconTile tone={feature.tone} size={54}>
									{feature.icon}
								</IconTile>
								<Typography variant='h5' component='h3' sx={{ mt: 3, mb: 1 }}>
									{feature.title}
								</Typography>
								<Typography variant='body2' sx={{ color: "text.secondary" }}>
									{feature.description}
								</Typography>
							</Surface>
						</StaggerItem>
					))}
				</Box>
			</Stagger>
		</Section>
	);
}
