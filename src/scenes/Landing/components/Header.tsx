"use client";
import { alpha, Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FloatingImage, MotionBox } from "./MotionComponents";

const APP_BAR_HEIGHT = 72;

const stagger = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.15, delayChildren: 0.2 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
	},
};

const MotionButton = motion.create(Button);

type HeaderProps = {
	headerTitle?: string;
	headerSubtitle?: string | null;
	headerImage?: string | null;
	isVideoExist: boolean;
};

export default function Header(props: HeaderProps) {
	const { headerTitle, headerSubtitle, headerImage } = props;
	const router = useRouter();

	return (
		<Box
			component='section'
			sx={{
				position: "relative",
				minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
				maxHeight: 960,
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background:
					"linear-gradient(160deg, #001D33 0%, #003A66 30%, #005C94 55%, #0082D2 80%, #0094E8 100%)",
				"&::before": {
					content: '""',
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(ellipse 80% 50% at 70% 40%, rgba(0,148,232,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(0,113,184,0.2) 0%, transparent 60%)",
					pointerEvents: "none",
				},
				"&::after": {
					content: '""',
					position: "absolute",
					top: "-50%",
					right: "-20%",
					width: "80%",
					height: "150%",
					background:
						"radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)",
					pointerEvents: "none",
				},
			}}
		>
			{/* Animated background orb */}
			<MotionBox
				animate={{
					scale: [1, 1.15, 1],
					opacity: [0.15, 0.25, 0.15],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				sx={{
					position: "absolute",
					top: "10%",
					left: "60%",
					width: { xs: 300, md: 500 },
					height: { xs: 300, md: 500 },
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(0,148,232,0.4) 0%, transparent 70%)",
					filter: "blur(60px)",
					pointerEvents: "none",
				}}
			/>

			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 120,
					background:
						"linear-gradient(to top, rgba(0,29,51,0.4) 0%, transparent 100%)",
					pointerEvents: "none",
				}}
			/>

			<Box
				sx={{
					maxWidth: 1200,
					width: "100%",
					mx: "auto",
					px: { xs: 3, sm: 4, md: 6 },
					position: "relative",
					zIndex: 2,
					py: { xs: 8, sm: 10, md: 0 },
				}}
			>
				<Stack
					direction={{ xs: "column-reverse", md: "row" }}
					alignItems='center'
					justifyContent='space-between'
					spacing={{ xs: 6, md: 8 }}
				>
					<MotionBox
						initial='hidden'
						animate='visible'
						variants={stagger}
						sx={{ flex: 1, maxWidth: { md: "55%" } }}
					>
						<Stack spacing={4} alignItems={{ xs: "center", md: "flex-start" }}>
							<MotionBox variants={fadeUp}>
								<Box
									sx={{
										display: "inline-flex",
										px: 2,
										py: 0.75,
										borderRadius: "100px",
										border: "1px solid",
										borderColor: alpha("#fff", 0.15),
										backgroundColor: alpha("#fff", 0.06),
										backdropFilter: "blur(8px)",
									}}
								>
									<Typography
										sx={{
											fontSize: "0.8125rem",
											fontWeight: 600,
											color: alpha("#fff", 0.8),
											letterSpacing: "0.02em",
										}}
									>
										منصة تعليمية متكاملة
									</Typography>
								</Box>
							</MotionBox>

							<MotionBox variants={fadeUp}>
								<Typography
									sx={{
										fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.25rem" },
										fontWeight: 800,
										lineHeight: 1.12,
										letterSpacing: "-0.03em",
										color: "#FFFFFF",
										textAlign: { xs: "center", md: "start" },
									}}
								>
									{headerTitle}
								</Typography>
							</MotionBox>

							{headerSubtitle && (
								<MotionBox variants={fadeUp}>
									<Typography
										sx={{
											fontSize: { xs: "1rem", sm: "1.125rem" },
											lineHeight: 1.75,
											color: alpha("#fff", 0.75),
											textAlign: { xs: "center", md: "start" },
											maxWidth: 520,
											fontWeight: 400,
										}}
									>
										{headerSubtitle}
									</Typography>
								</MotionBox>
							)}

							<MotionBox variants={fadeUp}>
								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={2}
									sx={{ width: { xs: "100%", sm: "auto" }, pt: 1 }}
									alignItems={{ xs: "stretch", md: "flex-start" }}
								>
									<MotionButton
										onClick={() => router.push("/classes")}
										size='large'
										endIcon={
											<ArrowBackIcon sx={{ fontSize: "20px !important" }} />
										}
										whileHover={{ scale: 1.04, y: -2 }}
										whileTap={{ scale: 0.97 }}
										transition={{ type: "spring", stiffness: 400, damping: 17 }}
										sx={{
											backgroundColor: "#FFFFFF",
											color: "#003A66",
											borderColor: "transparent",
											borderRadius: "12px",
											fontWeight: 700,
											fontSize: "1rem",
											px: 4,
											height: 52,
											boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
											"&:hover": {
												backgroundColor: "rgba(255,255,255,0.95) !important",
												boxShadow: "0 8px 28px rgba(0,0,0,0.2) !important",
											},
										}}
									>
										تعرف على الصفوف
									</MotionButton>
									<MotionButton
										onClick={() => {
											document
												.getElementById("about")
												?.scrollIntoView({ behavior: "smooth" });
										}}
										variant='outlined'
										size='large'
										whileHover={{ scale: 1.04, y: -2 }}
										whileTap={{ scale: 0.97 }}
										transition={{ type: "spring", stiffness: 400, damping: 17 }}
										sx={{
											borderColor: alpha("#fff", 0.25),
											color: "#FFFFFF",
											borderRadius: "12px",
											fontWeight: 600,
											fontSize: "1rem",
											px: 4,
											height: 52,
											backgroundColor: alpha("#fff", 0.06),
											"&:hover": {
												borderColor: alpha("#fff", 0.5),
												backgroundColor: "rgba(255,255,255,0.1) !important",
											},
										}}
									>
										تعرف علينا
									</MotionButton>
								</Stack>
							</MotionBox>
						</Stack>
					</MotionBox>

					{headerImage && (
						<FloatingImage
							sx={{
								flex: 1,
								maxWidth: { xs: 360, md: 480 },
								width: "100%",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Box
								sx={{
									position: "relative",
									width: "100%",
									borderRadius: "20px",
									overflow: "hidden",
								}}
							>
								<Image
									src={headerImage}
									alt='landing-header'
									layout='responsive'
									width={480}
									height={380}
									style={{
										width: "100%",
										height: "auto",
										objectFit: "cover",
										borderRadius: "20px",
									}}
								/>
							</Box>
						</FloatingImage>
					)}
				</Stack>
			</Box>
		</Box>
	);
}
