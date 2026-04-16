"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	FloatingImage,
	GlowOrb,
	GridPattern,
	MotionBox,
	OrbitRing,
	FloatingParticles,
} from "./MotionComponents";
import { DARK } from "./Styled";

const APP_BAR_HEIGHT = 72;

const stagger = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.15, delayChildren: 0.3 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
	},
} as const;

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
				maxHeight: 1000,
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
				background: `linear-gradient(160deg, ${DARK.bg} 0%, #070D1F 30%, #0A1128 55%, #0C1633 80%, ${DARK.surface} 100%)`,
			}}
		>
			<GridPattern />
			<FloatingParticles count={25} />

			<GlowOrb
				color='rgba(0,180,216,0.25)'
				size={600}
				top='-10%'
				right='-10%'
			/>
			<GlowOrb
				color='rgba(124,58,237,0.2)'
				size={500}
				bottom='-15%'
				left='-10%'
				delay={3}
			/>
			<GlowOrb
				color='rgba(0,180,216,0.12)'
				size={300}
				top='60%'
				left='50%'
				delay={5}
			/>

			<OrbitRing size={700} top='-20%' right='-15%' duration={25} />
			<OrbitRing
				size={500}
				bottom='-10%'
				left='-5%'
				duration={30}
				color='rgba(124,58,237,0.06)'
			/>

			{/* Bottom fade */}
			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 200,
					background: `linear-gradient(to top, ${DARK.bg} 0%, transparent 100%)`,
					pointerEvents: "none",
					zIndex: 1,
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
							{/* Badge */}
							<MotionBox variants={fadeUp}>
								<Box
									sx={{
										display: "inline-flex",
										alignItems: "center",
										gap: 1,
										px: 2.5,
										py: 0.75,
										borderRadius: "100px",
										border: `1px solid ${DARK.border}`,
										backgroundColor: "rgba(0,180,216,0.06)",
										backdropFilter: "blur(12px)",
									}}
								>
									<Box
										sx={{
											width: 6,
											height: 6,
											borderRadius: "50%",
											backgroundColor: DARK.accent,
											boxShadow: `0 0 8px ${DARK.accent}`,
										}}
									/>
									<Typography
										sx={{
											fontSize: "0.8125rem",
											fontWeight: 600,
											color: DARK.accent,
											letterSpacing: "0.04em",
										}}
									>
										منصة تعليمية متكاملة
									</Typography>
								</Box>
							</MotionBox>

							{/* Title */}
							<MotionBox variants={fadeUp}>
								<Typography
									sx={{
										fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.5rem" },
										fontWeight: 800,
										lineHeight: 1.1,
										letterSpacing: "-0.03em",
										color: DARK.text,
										textAlign: { xs: "center", md: "start" },
										"& span": {
											background: `linear-gradient(135deg, ${DARK.accent} 0%, #38BDF8 50%, ${DARK.purple} 100%)`,
											WebkitBackgroundClip: "text",
											WebkitTextFillColor: "transparent",
											backgroundClip: "text",
										},
									}}
								>
									{headerTitle || (
										<>
											اكتشف عالم <span>الفيزياء</span>
											<br />
											بطريقة جديدة
										</>
									)}
								</Typography>
							</MotionBox>

							{/* Subtitle */}
							{headerSubtitle && (
								<MotionBox variants={fadeUp}>
									<Typography
										sx={{
											fontSize: { xs: "1rem", sm: "1.125rem" },
											lineHeight: 1.8,
											color: DARK.textSecondary,
											textAlign: { xs: "center", md: "start" },
											maxWidth: 500,
											fontWeight: 400,
										}}
									>
										{headerSubtitle}
									</Typography>
								</MotionBox>
							)}

							{/* CTA Buttons */}
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
											background: `linear-gradient(135deg, ${DARK.accent} 0%, #0096C7 100%)`,
											color: "#FFFFFF",
											borderRadius: "14px",
											fontWeight: 700,
											fontSize: "1rem",
											px: 4,
											height: 54,
											boxShadow: `0 4px 20px rgba(0,180,216,0.3), 0 0 40px rgba(0,180,216,0.1)`,
											border: "1px solid rgba(0,180,216,0.3)",
											"&:hover": {
												background: `linear-gradient(135deg, #00C4E8 0%, ${DARK.accent} 100%) !important`,
												boxShadow: `0 8px 32px rgba(0,180,216,0.4), 0 0 60px rgba(0,180,216,0.15) !important`,
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
											borderColor: DARK.border,
											color: DARK.text,
											borderRadius: "14px",
											fontWeight: 600,
											fontSize: "1rem",
											px: 4,
											height: 54,
											backgroundColor: "rgba(255,255,255,0.03)",
											backdropFilter: "blur(8px)",
											"&:hover": {
												borderColor: DARK.borderHover,
												backgroundColor: "rgba(0,180,216,0.06) !important",
											},
										}}
									>
										تعرف علينا
									</MotionButton>
								</Stack>
							</MotionBox>
						</Stack>
					</MotionBox>

					{/* Hero Image */}
					{headerImage && (
						<FloatingImage
							sx={{
								flex: 1,
								maxWidth: { xs: 340, md: 460 },
								width: "100%",
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Box
								sx={{
									position: "relative",
									width: "100%",
									borderRadius: "24px",
									overflow: "hidden",
									border: `1px solid ${DARK.border}`,
									boxShadow: `0 20px 60px rgba(0,0,0,0.5), ${DARK.glow}`,
								}}
							>
								<Image
									src={headerImage}
									alt='landing-header'
									layout='responsive'
									width={460}
									height={370}
									style={{
										width: "100%",
										height: "auto",
										objectFit: "cover",
										borderRadius: "24px",
									}}
								/>
								{/* Glow overlay */}
								<Box
									sx={{
										position: "absolute",
										inset: 0,
										background: `linear-gradient(180deg, transparent 60%, rgba(0,180,216,0.08) 100%)`,
										pointerEvents: "none",
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
