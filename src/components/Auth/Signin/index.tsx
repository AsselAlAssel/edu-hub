"use client";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (
		<Stack
			direction='column'
			justifyContent='center'
			alignItems='center'
			spacing={2}
			sx={{
				py: { xs: 10, md: 16 },
				px: 2,
			}}
		>
			<Box
				sx={{
					maxWidth: "420px",
					width: "100%",
					backgroundColor: "#FFFFFF",
					borderRadius: "20px",
					border: "1px solid #EAECF0",
					boxShadow: "0 4px 24px rgba(16, 24, 40, 0.06)",
					p: { xs: 3, sm: 4 },
				}}
			>
				<Stack spacing={3} alignItems='center' mb={3}>
					<Image
						src='/images/logo/logo.svg'
						alt='Logo'
						width={48}
						height={48}
					/>
					<Box textAlign='center'>
						<Typography variant='h5' sx={{ fontWeight: 700, mb: 0.5 }}>
							تسجيل الدخول
						</Typography>
						<Typography sx={{ color: "text.tertiary", fontSize: "0.9375rem" }}>
							أدخل بياناتك للمتابعة
						</Typography>
					</Box>
				</Stack>
				<SigninWithPassword />
			</Box>
		</Stack>
	);
}
