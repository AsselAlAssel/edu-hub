import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<Box bgcolor={"#161B26"} pt={8} pb={6}>
			<Box
				maxWidth={1280}
				margin={"auto"}
				px={{
					xs: 4,
					md: 0,
				}}
			>
				<Stack
					spacing={{
						xs: 5,
					}}
					alignItems={"flex-start"}
				>
					<Stack spacing={4} alignItems={"flex-start"}>
						<Link href={"/"}>
							<Image
								src='/images/logo/logo.svg'
								alt='Logo'
								width={50}
								height={50}
							/>
						</Link>
						<Typography color={"#fff"}>الفيزياء في مكانٍ واحد</Typography>
					</Stack>
					<Stack
						direction={{
							xs: "column",
							md: "row",
						}}
						spacing={4}
						justifyContent={"space-between"}
						sx={(theme) => ({
							pt: 4,
							borderTop: "1px solid #333741",
							width: "100%",
							[theme.breakpoints.down("sm")]: {
								margin: "auto",
							},
						})}
						alignItems={"flex-start"}
					>
						<Typography color={"#94969C"}>
							© 2024 جميع الحقوق محفوظة
						</Typography>
						<Stack direction={"row"} spacing={3}>
							<Link
								href={
									"https://www.facebook.com/profile.php?id=100088599626669&mibextid=ZbWKwL"
								}
							>
								<FacebookRoundedIcon
									sx={{
										color: "#94969C",
									}}
								/>
							</Link>
							<Link href={"https://www.youtube.com/@mohammadsubuh"}>
								<YouTubeIcon
									sx={{
										color: "#94969C",
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
