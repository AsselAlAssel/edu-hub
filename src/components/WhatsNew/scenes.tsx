"use client";
import { GoogleLogo } from "@/components/Auth/GoogleSigninDialog";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import { Avatar, Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
	animate,
	motion,
	useMotionValue,
	useTransform,
	type Transition,
} from "framer-motion";
import { useEffect, type ReactNode } from "react";

/*
 * Animated mini-scenes for the "what's new" dialog. Each one replays every
 * time its slide is shown (the dialog remounts it via `key`), is decorative
 * (aria-hidden: the slide text carries the meaning) and is drawn from the
 * site's own pieces — no images to load.
 */

const spring: Transition = { type: "spring", stiffness: 420, damping: 22 };

/** Fixed-size stage so slides never change the dialog's height. */
export function Stage({ children }: { children: ReactNode }) {
	return (
		<Box
			aria-hidden
			sx={(theme) => ({
				position: "relative",
				height: { xs: 190, sm: 210 },
				display: "grid",
				placeItems: "center",
				overflow: "hidden",
				borderRadius: `${theme.tokens.radii.lg}px`,
				border: `1px solid ${theme.tokens.colors.border}`,
				backgroundColor: theme.tokens.colors.surfaceSecondary,
				// Faint lab-grid backdrop, like the rest of the site.
				backgroundImage: `linear-gradient(${alpha(theme.tokens.colors.cyan, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.tokens.colors.cyan, 0.07)} 1px, transparent 1px)`,
				backgroundSize: "28px 28px",
			})}
		>
			{children}
		</Box>
	);
}

/** Counts up from 0 to `to` (e.g. a percentage). */
function Counter({
	to,
	delay = 0,
	suffix = "",
}: {
	to: number;
	delay?: number;
	suffix?: string;
}) {
	const value = useMotionValue(0);
	const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);
	useEffect(() => {
		const controls = animate(value, to, {
			duration: 1.4,
			delay,
			ease: [0.22, 1, 0.36, 1],
		});
		return () => controls.stop();
	}, [value, to, delay]);
	return <motion.span className='qa-latin'>{text}</motion.span>;
}

/** A video card in miniature: thumbnail, two title lines, completion dot. */
function MiniVideoCard({
	children,
	done,
	doneDelay = 0,
	showIcon = true,
}: {
	children?: ReactNode;
	done?: boolean;
	doneDelay?: number;
	/** The flask placeholder; off when a play button takes the centre. */
	showIcon?: boolean;
}) {
	return (
		<Box
			sx={(theme) => ({
				width: 200,
				overflow: "hidden",
				borderRadius: `${theme.tokens.radii.md}px`,
				border: `1px solid ${theme.tokens.colors.border}`,
				backgroundColor: theme.tokens.colors.surface,
				boxShadow: theme.tokens.shadows.medium,
			})}
		>
			<Box
				sx={(theme) => ({
					position: "relative",
					aspectRatio: "16 / 9",
					display: "grid",
					placeItems: "center",
					color: "common.white",
					backgroundImage: theme.tokens.gradients.accent,
					"& > svg": { fontSize: 34, opacity: 0.9 },
				})}
			>
				{showIcon ? <ScienceOutlinedIcon /> : null}
				{children}
			</Box>
			<Box sx={{ p: 1.25, display: "flex", alignItems: "center", gap: 1 }}>
				<Box sx={{ flex: 1 }}>
					<Box
						sx={(theme) => ({
							height: 8,
							width: "85%",
							borderRadius: 4,
							backgroundColor: theme.tokens.colors.border,
						})}
					/>
					<Box
						sx={(theme) => ({
							mt: 0.75,
							height: 8,
							width: "55%",
							borderRadius: 4,
							backgroundColor: theme.tokens.colors.border,
						})}
					/>
				</Box>
				<Box sx={{ position: "relative", width: 22, height: 22 }}>
					<RadioButtonUncheckedRoundedIcon
						sx={{ position: "absolute", fontSize: 22, color: "text.secondary" }}
					/>
					{done ? (
						<motion.span
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ ...spring, delay: doneDelay }}
							style={{ position: "absolute", inset: 0, display: "grid" }}
						>
							<CheckCircleRoundedIcon
								sx={{ fontSize: 22, color: "success.main" }}
							/>
						</motion.span>
					) : null}
				</Box>
			</Box>
		</Box>
	);
}

/** Small pill on a thumbnail ("مكتمل", "تابع من 2:15"). */
function Badge({
	children,
	tone,
	delay,
}: {
	children: ReactNode;
	tone: "success" | "dark";
	delay: number;
}) {
	return (
		<Box
			component={motion.span}
			initial={{ opacity: 0, y: -8, scale: 0.8 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ ...spring, delay }}
			sx={(theme) => ({
				position: "absolute",
				top: 8,
				insetInlineStart: 8,
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				px: 1,
				py: 0.25,
				borderRadius: 999,
				fontSize: "0.7rem",
				fontWeight: 700,
				color: "common.white",
				backgroundColor:
					tone === "success"
						? theme.palette.success.main
						: alpha(theme.palette.common.black, 0.65),
				"& svg": { fontSize: 13 },
			})}
		>
			{children}
		</Box>
	);
}

/** 1. Google sign-in: the pointer clicks the button, the avatar appears. */
export function SigninScene() {
	return (
		<Stage>
			<Box sx={{ position: "relative", display: "grid", placeItems: "center" }}>
				{/* Button: pressed at 1.3s, then gives way to the signed-in chip. */}
				<motion.div
					initial={{ opacity: 1, scale: 1 }}
					animate={{ scale: [1, 1, 0.94, 1, 1], opacity: [1, 1, 1, 1, 0] }}
					transition={{ duration: 2.1, times: [0, 0.6, 0.66, 0.74, 1] }}
					style={{ gridArea: "1 / 1" }}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1.25,
							px: 2.25,
							py: 1.25,
							borderRadius: 2,
							backgroundColor: "#fff",
							border: "1px solid #dadce0",
							color: "#1f1f1f",
							fontWeight: 600,
							fontSize: "0.9rem",
							boxShadow: "0 2px 8px rgba(15, 23, 42, 0.12)",
							whiteSpace: "nowrap",
						}}
					>
						<GoogleLogo />
						المتابعة باستخدام Google
					</Box>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ ...spring, delay: 2 }}
					style={{ gridArea: "1 / 1" }}
				>
					<Box
						sx={(theme) => ({
							display: "flex",
							alignItems: "center",
							gap: 1.25,
							py: 0.75,
							paddingInlineStart: 0.75,
							paddingInlineEnd: 2,
							borderRadius: 999,
							border: `1px solid ${theme.tokens.colors.border}`,
							backgroundColor: theme.tokens.colors.surface,
							boxShadow: theme.tokens.shadows.medium,
						})}
					>
						<Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>
							م
						</Avatar>
						<Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
							أهلًا بك!
						</Typography>
						<CheckCircleRoundedIcon
							sx={{ color: "success.main", fontSize: 20 }}
						/>
					</Box>
				</motion.div>
				{/* Pointer glides in from the corner and taps the button. */}
				<motion.svg
					width='26'
					height='26'
					viewBox='0 0 24 24'
					initial={{ x: 90, y: 80, opacity: 0 }}
					animate={{
						x: [90, 90, 10, 10, 10],
						y: [80, 80, 14, 16, 14],
						opacity: [0, 1, 1, 1, 0],
					}}
					transition={{ duration: 2.1, times: [0, 0.15, 0.6, 0.68, 1] }}
					style={{ position: "absolute", top: "50%", left: "50%" }}
				>
					<path
						d='M5 3l14 8-6 1.5L10 19z'
						fill='#fff'
						stroke='#0f172a'
						strokeWidth='1.5'
						strokeLinejoin='round'
					/>
				</motion.svg>
			</Box>
		</Stage>
	);
}

/** 2. Auto-complete: the watch bar fills to 90%, the video is marked done. */
export function CompleteScene() {
	return (
		<Stage>
			<MiniVideoCard done doneDelay={2.1}>
				<Badge tone='success' delay={2.1}>
					<CheckCircleRoundedIcon />
					مكتمل
				</Badge>
				{/* Watched share of the video, along the thumbnail's bottom edge. */}
				<Box
					sx={{
						position: "absolute",
						insetInline: 0,
						bottom: 0,
						height: 5,
						backgroundColor: "rgba(0,0,0,0.3)",
					}}
				>
					<Box
						component={motion.div}
						initial={{ width: "0%" }}
						animate={{ width: "90%" }}
						transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
						sx={{ height: "100%", backgroundColor: "success.main" }}
					/>
				</Box>
				<Box
					component='span'
					sx={{
						position: "absolute",
						bottom: 10,
						insetInlineEnd: 8,
						fontSize: "0.75rem",
						fontWeight: 800,
					}}
				>
					<Counter to={90} delay={0.3} suffix='%' />
				</Box>
			</MiniVideoCard>
		</Stage>
	);
}

/** 3. Resume: the playhead sits at 2:15 and the card offers to continue. */
export function ResumeScene() {
	return (
		<Stage>
			<MiniVideoCard showIcon={false}>
				<Badge tone='dark' delay={1.4}>
					تابع من <span className='qa-latin'>2:15</span>
				</Badge>
				<motion.span
					animate={{ scale: [1, 1.12, 1] }}
					transition={{ duration: 1.6, repeat: Infinity, delay: 1.8 }}
					style={{
						position: "absolute",
						display: "grid",
						placeItems: "center",
						width: 40,
						height: 40,
						borderRadius: "50%",
						backgroundColor: "rgba(0,0,0,0.55)",
						border: "1px solid rgba(255,255,255,0.35)",
					}}
				>
					<PlayArrowRoundedIcon sx={{ fontSize: 26 }} />
				</motion.span>
				{/* Timeline with the saved position. */}
				<Box
					sx={{
						position: "absolute",
						insetInline: 10,
						bottom: 8,
						height: 4,
						borderRadius: 2,
						backgroundColor: "rgba(0,0,0,0.35)",
					}}
				>
					<motion.div
						initial={{ width: "0%" }}
						animate={{ width: "35%" }}
						transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
						style={{
							position: "relative",
							height: "100%",
							borderRadius: 2,
							backgroundColor: "#fff",
						}}
					>
						<Box
							sx={{
								position: "absolute",
								top: "50%",
								insetInlineEnd: -6,
								width: 12,
								height: 12,
								mt: "-6px",
								borderRadius: "50%",
								backgroundColor: "#fff",
								boxShadow: "0 0 0 3px rgba(255,255,255,0.35)",
							}}
						/>
					</motion.div>
				</Box>
			</MiniVideoCard>
		</Stage>
	);
}

/** 4. "تقدّمي": the overall percentage counts up and class bars fill. */
export function ProgressScene() {
	const classes = [
		{ name: "توجيهي", value: 64 },
		{ name: "الصف الحادي عشر", value: 30 },
	];
	return (
		<Stage>
			<Box
				sx={(theme) => ({
					width: 250,
					p: 2,
					borderRadius: `${theme.tokens.radii.md}px`,
					border: `1px solid ${theme.tokens.colors.border}`,
					backgroundColor: theme.tokens.colors.surface,
					boxShadow: theme.tokens.shadows.medium,
				})}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "baseline",
						justifyContent: "space-between",
						mb: 1.5,
					}}
				>
					<Typography sx={{ fontWeight: 800 }}>تقدّمي</Typography>
					<Typography
						sx={{ fontWeight: 800, fontSize: "1.5rem", color: "primary.main" }}
					>
						<Counter to={47} delay={0.2} suffix='%' />
					</Typography>
				</Box>
				{classes.map((item, index) => (
					<Box key={item.name} sx={{ mt: index ? 1.25 : 0 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								fontSize: "0.75rem",
								color: "text.secondary",
								mb: 0.5,
							}}
						>
							<span>{item.name}</span>
							<Counter to={item.value} delay={0.4 + index * 0.25} suffix='%' />
						</Box>
						<Box
							sx={(theme) => ({
								height: 8,
								borderRadius: 4,
								overflow: "hidden",
								backgroundColor: alpha(theme.palette.primary.main, 0.15),
							})}
						>
							<Box
								component={motion.div}
								initial={{ width: "0%" }}
								animate={{ width: `${item.value}%` }}
								transition={{
									duration: 1.4,
									delay: 0.4 + index * 0.25,
									ease: [0.22, 1, 0.36, 1],
								}}
								sx={(theme) => ({
									height: "100%",
									borderRadius: 4,
									backgroundImage: theme.tokens.gradients.primary,
								})}
							/>
						</Box>
					</Box>
				))}
			</Box>
		</Stage>
	);
}
