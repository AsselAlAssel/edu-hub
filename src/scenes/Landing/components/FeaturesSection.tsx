"use client";
import IconTile from "@/components/ui/IconTile";
import { Section, SectionHeader } from "@/components/ui/Section";
import Surface from "@/components/ui/Surface";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import { Box, Typography } from "@mui/material";

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
		tone: "success",
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
				title='كل ما تحتاجه لفهم الفيزياء في مكان واحد'
				description='أدوات بسيطة صُممت لتساعدك على التركيز في التعلّم.'
			/>
			<Box
				component='ul'
				sx={{
					listStyle: "none",
					m: 0,
					p: 0,
					display: "grid",
					gap: 2.5,
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, minmax(0, 1fr))",
						lg: "repeat(4, minmax(0, 1fr))",
					},
				}}
			>
				{FEATURES.map((feature) => (
					<Surface
						key={feature.title}
						component='li'
						padding={3}
						sx={{ height: "100%" }}
					>
						<IconTile tone={feature.tone}>{feature.icon}</IconTile>
						<Typography variant='h5' component='h3' sx={{ mt: 2.5, mb: 1 }}>
							{feature.title}
						</Typography>
						<Typography variant='body2' sx={{ color: "text.secondary" }}>
							{feature.description}
						</Typography>
					</Surface>
				))}
			</Box>
		</Section>
	);
}
