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
				minHeight: "60vh",
			}}
		>
			<Box
				sx={{
					maxWidth: "440px",
					width: "100%",
					backgroundColor: "#FFFFFF",
					borderRadius: "20px",
					border: "1px solid #EAECF0",
					boxShadow:
						"0 4px 24px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.04)",
					p: { xs: 3, sm: 4 },
					transition: "box-shadow 0.3s ease",
					"&:hover": {
						boxShadow:
							"0 8px 32px rgba(16, 24, 40, 0.08), 0 4px 12px rgba(16, 24, 40, 0.04)",
					},
				}}
			>
				<Stack spacing={3} alignItems='center' mb={3}>
					<Box
						sx={{
							width: 56,
							height: 56,
							borderRadius: "16px",
							background: "linear-gradient(135deg, #F0F7FF 0%, #E6F0FF 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Image
							src='/images/logo/logo.svg'
							alt='Logo'
							width={40}
							height={40}
						/>
					</Box>
					<Box textAlign='center'>
						<Typography
							variant='h5'
							sx={{
								fontWeight: 800,
								mb: 0.75,
								letterSpacing: "-0.01em",
							}}
						>
							تسجيل الدخول
						</Typography>
						<Typography
							sx={{
								color: "text.tertiary",
								fontSize: "0.9375rem",
								lineHeight: 1.6,
							}}
						>
							أدخل بياناتك للمتابعة
						</Typography>
					</Box>
				</Stack>
				<SigninWithPassword />
			</Box>
		</Stack>
	);
}
