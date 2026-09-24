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
				position: "relative",
				overflow: "hidden",
				isolation: "isolate",
				minHeight: `calc(100vh - ${theme.tokens.layout.headerHeight}px)`,
				display: "grid",
				placeItems: "center",
				px: 2,
				py: { xs: 6, md: 10 },
				backgroundImage: `radial-gradient(45% 40% at 50% 10%, ${alpha(theme.tokens.colors.cyan, 0.16)}, transparent 70%), radial-gradient(35% 35% at 85% 85%, ${alpha(theme.tokens.colors.violet, 0.14)}, transparent 70%)`,
				// Light grid, masked to the centre.
				"&::before": {
					content: '""',
					position: "absolute",
					inset: 0,
					zIndex: -1,
					backgroundImage: `linear-gradient(${alpha(theme.tokens.colors.cyan, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.tokens.colors.cyan, 0.06)} 1px, transparent 1px)`,
					backgroundSize: "56px 56px",
					maskImage:
						"radial-gradient(ellipse 60% 60% at 50% 45%, #000 20%, transparent 75%)",
					WebkitMaskImage:
						"radial-gradient(ellipse 60% 60% at 50% 45%, #000 20%, transparent 75%)",
				},
			})}
		>
			{/* Slow orbit rings behind the card (decorative). */}
			<Box
				aria-hidden
				sx={(theme) => ({
					position: "absolute",
					zIndex: -1,
					width: "min(720px, 140vw)",
					aspectRatio: "1 / 1",
					borderRadius: "50%",
					border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.16)}`,
					"&::before, &::after": {
						content: '""',
						position: "absolute",
						borderRadius: "50%",
					},
					"&::before": {
						inset: "14%",
						border: `1px dashed ${alpha(theme.tokens.colors.violet, 0.28)}`,
						animation: "qaSpin 80s linear infinite",
					},
					"&::after": {
						top: "-5px",
						left: "50%",
						width: 10,
						height: 10,
						backgroundColor: theme.tokens.colors.cyan,
						boxShadow: `0 0 16px ${theme.tokens.colors.cyan}`,
					},
					animation: "qaSpin 40s linear infinite",
					"@keyframes qaSpin": { to: { transform: "rotate(360deg)" } },
				})}
			/>

			<Surface
				variant='glass'
				className='qa-page'
				sx={(theme) => ({
					width: "100%",
					maxWidth: 460,
					p: { xs: 3, sm: 5 },
					overflow: "hidden",
					borderColor: alpha(theme.tokens.colors.cyan, 0.25),
					boxShadow: `${theme.tokens.shadows.strong}${theme.palette.mode === "dark" ? `, 0 0 60px ${alpha(theme.tokens.colors.cyan, 0.1)}` : ""}`,
					"&::before": {
						content: '""',
						position: "absolute",
						insetInline: 0,
						top: 0,
						height: 3,
						backgroundImage: theme.tokens.gradients.text,
					},
				})}
			>
				<Stack
					alignItems='center'
					spacing={2}
					sx={{ mb: 4, textAlign: "center" }}
				>
					<Box
						sx={(theme) => ({
							width: 64,
							height: 64,
							display: "grid",
							placeItems: "center",
							borderRadius: `${theme.tokens.radii.lg}px`,
							backgroundColor: theme.tokens.colors.surfaceSecondary,
							border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.4)}`,
							boxShadow:
								theme.palette.mode === "dark"
									? `0 0 30px ${alpha(theme.tokens.colors.cyan, 0.25)}`
									: theme.tokens.shadows.subtle,
						})}
					>
						<Image
							src='/images/logo/logo.svg'
							alt='شعار محمد صبح للفيزياء'
							width={44}
							height={44}
							priority
						/>
					</Box>
					<Box>
						<Typography
							variant='h1'
							sx={{ fontSize: { xs: "1.875rem", sm: "2.125rem" } }}
						>
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
