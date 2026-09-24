"use client";
import Surface from "@/components/ui/Surface";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { Suspense } from "react";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (
		<Box
			sx={(theme) => ({
				minHeight: `calc(100vh - ${theme.tokens.layout.headerHeight}px)`,
				display: "grid",
				placeItems: "center",
				px: 2,
				py: { xs: 6, md: 10 },
				backgroundImage: `radial-gradient(50% 45% at 50% 0%, ${alpha(theme.tokens.colors.cyan, 0.12)}, transparent 70%)`,
			})}
		>
			<Surface
				variant='elevated'
				sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 4.5 } }}
			>
				<Stack
					alignItems='center'
					spacing={2}
					sx={{ mb: 4, textAlign: "center" }}
				>
					<Box
						sx={(theme) => ({
							width: 60,
							height: 60,
							display: "grid",
							placeItems: "center",
							borderRadius: `${theme.tokens.radii.lg}px`,
							backgroundColor: theme.tokens.colors.surfaceSecondary,
							border: `1px solid ${theme.tokens.colors.border}`,
						})}
					>
						<Image
							src='/images/logo/logo.svg'
							alt='شعار محمد صبح للفيزياء'
							width={42}
							height={42}
							priority
						/>
					</Box>
					<Box>
						<Typography variant='h1' sx={{ fontSize: "1.75rem" }}>
							تسجيل الدخول
						</Typography>
						<Typography variant='body2' sx={{ color: "text.secondary", mt: 1 }}>
							أدخل بياناتك للوصول إلى لوحة إدارة المحتوى.
						</Typography>
					</Box>
				</Stack>
				{/* useSearchParams requires a Suspense boundary in the App Router. */}
				<Suspense>
					<SigninWithPassword />
				</Suspense>
			</Surface>
		</Box>
	);
}
