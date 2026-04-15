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
			bgcolor={"#161B26"}
			pt={8}
			pb={4}
		>
			<Box
				maxWidth={1216}
				margin={"auto"}
				px={{
					xs: 3,
					sm: 4,
					md: 8,
				}}
			>
				<Stack spacing={5} alignItems={"flex-start"}>
					<Stack spacing={3} alignItems={"flex-start"}>
						<Link href={"/"} aria-label='الصفحة الرئيسية'>
							<Image
								src='/images/logo/logo.svg'
								alt='شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh'
								width={48}
								height={48}
							/>
						</Link>
						<Typography
							color={"#D0D5DD"}
							sx={{
								fontSize: "0.9375rem",
							}}
						>
							الفيزياء في مكانٍ واحد
						</Typography>
					</Stack>
					<Stack
						direction={{
							xs: "column",
							md: "row",
						}}
						spacing={3}
						justifyContent={"space-between"}
						sx={(theme) => ({
							pt: 4,
							borderTop: "1px solid #293040",
							width: "100%",
							[theme.breakpoints.down("sm")]: {
								margin: "auto",
							},
						})}
						alignItems={{ xs: "flex-start", md: "center" }}
					>
						<Typography color={"#98A2B3"} sx={{ fontSize: "0.875rem" }}>
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
										color: "#98A2B3",
										fontSize: 22,
										transition: "color 0.2s ease",
										"&:hover": {
											color: "#D0D5DD",
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
										color: "#98A2B3",
										fontSize: 22,
										transition: "color 0.2s ease",
										"&:hover": {
											color: "#D0D5DD",
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
