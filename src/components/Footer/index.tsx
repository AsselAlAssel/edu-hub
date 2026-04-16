import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<Box
			component='footer'
			role='contentinfo'
			sx={{
				bgcolor: "#0B1121",
				pt: 8,
				pb: 4,
				position: "relative",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 1,
					background:
						"linear-gradient(90deg, transparent 0%, rgba(0,136,221,0.15) 50%, transparent 100%)",
				},
			}}
		>
			<Box maxWidth={1200} margin='auto' px={{ xs: 3, sm: 4, md: 6 }}>
				<Stack spacing={5} alignItems='flex-start'>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						justifyContent='space-between'
						alignItems={{ xs: "flex-start", sm: "center" }}
						width='100%'
						spacing={3}
					>
						<Stack spacing={2.5} alignItems='flex-start'>
							<Link href='/' aria-label='الصفحة الرئيسية'>
								<Image
									src='/images/logo/logo.svg'
									alt='شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh'
									width={44}
									height={44}
								/>
							</Link>
							<Typography
								sx={{
									color: "#94A3B8",
									fontSize: "0.9375rem",
									lineHeight: 1.7,
								}}
							>
								الفيزياء في مكانٍ واحد
							</Typography>
						</Stack>
						<Stack direction='row' spacing={3.5} alignItems='center'>
							{[
								{ href: "/#home", label: "الرئيسية" },
								{ href: "/classes", label: "الصفوف" },
								{ href: "/#about", label: "عن المنصة" },
								{ href: "/#contact", label: "اتصل بنا" },
							].map((link) => (
								<Link
									key={link.href}
									href={link.href}
									style={{
										textDecoration: "none",
										color: "#94A3B8",
										fontSize: "0.875rem",
										fontWeight: 500,
										transition: "color 0.2s ease",
									}}
								>
									{link.label}
								</Link>
							))}
						</Stack>
					</Stack>
					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={3}
						justifyContent='space-between'
						sx={{
							pt: 5,
							borderTop: "1px solid rgba(255,255,255,0.06)",
							width: "100%",
						}}
						alignItems={{ xs: "flex-start", md: "center" }}
					>
						<Typography sx={{ color: "#475569", fontSize: "0.875rem" }}>
							© {new Date().getFullYear()} جميع الحقوق محفوظة
						</Typography>
						<Stack direction='row' spacing={2}>
							<Link
								href='https://www.facebook.com/profile.php?id=100088599626669&mibextid=ZbWKwL'
								aria-label='فيسبوك'
							>
								<FacebookRoundedIcon
									sx={{
										color: "#64748B",
										fontSize: 22,
										transition: "all 0.2s ease",
										"&:hover": {
											color: "#CBD5E1",
											transform: "translateY(-1px)",
										},
									}}
								/>
							</Link>
							<Link
								href='https://www.youtube.com/@mohammadsubuh'
								aria-label='يوتيوب'
							>
								<YouTubeIcon
									sx={{
										color: "#64748B",
										fontSize: 22,
										transition: "all 0.2s ease",
										"&:hover": {
											color: "#CBD5E1",
											transform: "translateY(-1px)",
										},
									}}
								/>
							</Link>
						</Stack>
					</Stack>
				</Stack>
			</Box>
		</Box>
	);
}
