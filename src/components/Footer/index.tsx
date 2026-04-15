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
				bgcolor: "#0F1724",
				pt: 8,
				pb: 4,
			}}
		>
			<Box
				maxWidth={1200}
				margin={"auto"}
				px={{
					xs: 3,
					sm: 4,
					md: 6,
				}}
			>
				<Stack spacing={5} alignItems={"flex-start"}>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						justifyContent='space-between'
						alignItems={{ xs: "flex-start", sm: "center" }}
						width='100%'
						spacing={3}
					>
						<Stack spacing={2.5} alignItems={"flex-start"}>
							<Link href={"/"} aria-label='الصفحة الرئيسية'>
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
									lineHeight: 1.6,
								}}
							>
								الفيزياء في مكانٍ واحد
							</Typography>
						</Stack>
						<Stack direction='row' spacing={3} alignItems='center'>
							<Link
								href='/#home'
								style={{
									textDecoration: "none",
									color: "#94A3B8",
									fontSize: "0.875rem",
									fontWeight: 500,
									transition: "color 0.2s ease",
								}}
							>
								الرئيسية
							</Link>
							<Link
								href='/classes'
								style={{
									textDecoration: "none",
									color: "#94A3B8",
									fontSize: "0.875rem",
									fontWeight: 500,
								}}
							>
								الصفوف
							</Link>
							<Link
								href='/#about'
								style={{
									textDecoration: "none",
									color: "#94A3B8",
									fontSize: "0.875rem",
									fontWeight: 500,
								}}
							>
								عن المنصة
							</Link>
							<Link
								href='/#contact'
								style={{
									textDecoration: "none",
									color: "#94A3B8",
									fontSize: "0.875rem",
									fontWeight: 500,
								}}
							>
								اتصل بنا
							</Link>
						</Stack>
					</Stack>
					<Stack
						direction={{
							xs: "column",
							md: "row",
						}}
						spacing={3}
						justifyContent={"space-between"}
						sx={{
							pt: 4,
							borderTop: "1px solid #1E293B",
							width: "100%",
						}}
						alignItems={{ xs: "flex-start", md: "center" }}
					>
						<Typography sx={{ color: "#64748B", fontSize: "0.875rem" }}>
							© {new Date().getFullYear()} جميع الحقوق محفوظة
						</Typography>
						<Stack direction={"row"} spacing={2}>
							<Link
								href={
									"https://www.facebook.com/profile.php?id=100088599626669&mibextid=ZbWKwL"
								}
								aria-label='فيسبوك'
							>
								<FacebookRoundedIcon
									sx={{
										color: "#64748B",
										fontSize: 22,
										transition: "color 0.2s ease",
										"&:hover": {
											color: "#CBD5E1",
										},
									}}
								/>
							</Link>
							<Link
								href={"https://www.youtube.com/@mohammadsubuh"}
								aria-label='يوتيوب'
							>
								<YouTubeIcon
									sx={{
										color: "#64748B",
										fontSize: 22,
										transition: "color 0.2s ease",
										"&:hover": {
											color: "#CBD5E1",
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
