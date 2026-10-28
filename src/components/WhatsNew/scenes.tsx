"use client";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Typography } from "@mui/material";
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

/** Small pill that pops in ("مفتوحة لك", "أفضل نتيجة"). */
function Badge({
	children,
	tone,
	delay,
}: {
	children: ReactNode;
	tone: "success" | "primary";
	delay: number;
}) {
	return (
		<Box
			component={motion.span}
			initial={{ opacity: 0, y: -8, scale: 0.8 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ ...spring, delay }}
			sx={(theme) => ({
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				px: 1,
				py: 0.25,
				borderRadius: 999,
				fontSize: "0.7rem",
				fontWeight: 700,
				color: "common.white",
				backgroundColor: theme.palette[tone].main,
				"& svg": { fontSize: 13 },
			})}
		>
			{children}
		</Box>
	);
}

/** White card used by every scene. */
const cardSx = (width: number) => (theme: import("@mui/material").Theme) => ({
	width,
	p: 1.5,
	borderRadius: `${theme.tokens.radii.md}px`,
	border: `1px solid ${theme.tokens.colors.border}`,
	backgroundColor: theme.tokens.colors.surface,
	boxShadow: theme.tokens.shadows.medium,
});

/** Grey placeholder line standing in for text. */
function Line({ width }: { width: string }) {
	return (
		<Box
			sx={(theme) => ({
				height: 8,
				width,
				borderRadius: 4,
				backgroundColor: theme.tokens.colors.border,
			})}
		/>
	);
}

/** Chat bubble that slides in from its own side. */
function Bubble({
	children,
	mine,
	delay,
}: {
	children: ReactNode;
	mine?: boolean;
	delay: number;
}) {
	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0, y: 10, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ ...spring, delay }}
			sx={{
				alignSelf: mine ? "flex-start" : "flex-end",
				maxWidth: "85%",
				px: 1.25,
				py: 0.75,
				borderRadius: 2,
				fontSize: "0.78rem",
				lineHeight: 1.6,
				color: "#111b21",
				backgroundColor: mine ? "#d9fdd3" : "#fff",
				boxShadow: "0 1px 2px rgba(15, 23, 42, 0.15)",
			}}
		>
			{children}
		</Box>
	);
}

/** WhatsApp chat: the ready message goes out, the unit-opened reply comes back. */
function ChatWindow() {
	return (
		<Box
			sx={(theme) => ({
				width: 260,
				overflow: "hidden",
				borderRadius: `${theme.tokens.radii.md}px`,
				boxShadow: theme.tokens.shadows.medium,
				backgroundColor: "#efeae2",
			})}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					px: 1.5,
					py: 0.75,
					color: "#fff",
					backgroundColor: "#075e54",
					fontSize: "0.8rem",
					fontWeight: 700,
				}}
			>
				<WhatsAppIcon sx={{ fontSize: 18 }} />
				المنصة
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 0.75,
					p: 1.25,
					minHeight: 120,
				}}
			>
				<Bubble mine delay={0.3}>
					أرغب بالاشتراك في «الوحدة الأولى» 🙏
				</Bubble>
				{/* Typing dots, then the reply takes their place. */}
				<Box
					sx={{
						alignSelf: "flex-end",
						display: "grid",
						justifyItems: "end",
						"& > *": { gridArea: "1 / 1" },
					}}
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 1, 0] }}
						transition={{
							duration: 1.1,
							delay: 0.9,
							times: [0, 0.1, 0.85, 1],
						}}
						style={{
							display: "flex",
							gap: 4,
							padding: "8px 10px",
							borderRadius: 8,
							backgroundColor: "#fff",
						}}
					>
						{[0, 1, 2].map((i) => (
							<motion.span
								key={i}
								animate={{ y: [0, -3, 0] }}
								transition={{
									duration: 0.6,
									repeat: Infinity,
									delay: i * 0.12,
								}}
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									backgroundColor: "#8696a0",
								}}
							/>
						))}
					</motion.div>
					<Bubble delay={2}>تم فتح الوحدة على حسابك ✅ بالتوفيق!</Bubble>
				</Box>
			</Box>
		</Box>
	);
}

/** 2. Subscribe: the ready WhatsApp message goes out, the unit gets opened. */
export function SubscribeScene() {
	return (
		<Stage>
			<ChatWindow />
		</Stage>
	);
}

/** 4. Exam: options drop in, one gets picked, the question map advances. */
export function ExamScene() {
	const options = ["أ", "ب", "ج", "د"];
	const picked = 1;
	return (
		<Stage>
			<Box sx={cardSx(250)}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 1,
					}}
				>
					<Typography sx={{ fontWeight: 800, fontSize: "0.85rem" }}>
						سؤال <span className='qa-latin'>3</span> من{" "}
						<span className='qa-latin'>5</span>
					</Typography>
					{/* Question map: answered dots, the current one turns green. */}
					<Box sx={{ display: "flex", gap: 0.5 }}>
						{[0, 1, 2, 3, 4].map((i) => (
							<Box
								key={i}
								sx={(theme) => ({
									position: "relative",
									width: 8,
									height: 8,
									borderRadius: "50%",
									backgroundColor:
										i < 2
											? theme.palette.primary.main
											: theme.tokens.colors.border,
								})}
							>
								{/* This question: answered once the option is picked. */}
								{i === 2 ? (
									<Box
										component={motion.span}
										initial={{ scale: 0 }}
										animate={{ scale: [0, 1.4, 1] }}
										transition={{ duration: 0.4, delay: 1.5 }}
										sx={{
											position: "absolute",
											inset: 0,
											borderRadius: "50%",
											backgroundColor: "primary.main",
										}}
									/>
								) : null}
							</Box>
						))}
					</Box>
				</Box>
				<Line width='90%' />
				<Box sx={{ mt: 0.75, mb: 1.25 }}>
					<Line width='60%' />
				</Box>
				<Box
					sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}
				>
					{options.map((letter, i) => (
						<Box
							key={letter}
							component={motion.div}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...spring, delay: 0.2 + i * 0.1 }}
							sx={(theme) => ({
								position: "relative",
								display: "flex",
								alignItems: "center",
								gap: 0.75,
								p: 0.75,
								borderRadius: 1.5,
								border: `1px solid ${theme.tokens.colors.border}`,
								fontSize: "0.75rem",
								fontWeight: 700,
							})}
						>
							{letter}
							<Line width='60%' />
							{/* The chosen answer: a primary frame and tick at 1.3s. */}
							{i === picked ? (
								<Box
									component={motion.span}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ ...spring, delay: 1.3 }}
									sx={(theme) => ({
										position: "absolute",
										inset: -1,
										display: "flex",
										alignItems: "center",
										justifyContent: "flex-end",
										px: 0.5,
										borderRadius: 1.5,
										border: `2px solid ${theme.palette.primary.main}`,
										backgroundColor: alpha(theme.palette.primary.main, 0.08),
									})}
								>
									<CheckCircleRoundedIcon
										sx={{ fontSize: 16, color: "primary.main" }}
									/>
								</Box>
							) : null}
						</Box>
					))}
				</Box>
			</Box>
		</Stage>
	);
}

/** Score ring filling up, the percentage counting, then the best-score pill. */
function ScoreCard() {
	const percent = 90;
	const r = 34;
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Box sx={{ position: "relative", width: 88, height: 88 }}>
				<svg
					width='88'
					height='88'
					viewBox='0 0 88 88'
					style={{ transform: "rotate(-90deg)" }}
				>
					<Box
						component='circle'
						cx='44'
						cy='44'
						r={r}
						fill='none'
						strokeWidth='8'
						sx={{ stroke: (theme) => theme.tokens.colors.border }}
					/>
					<Box
						component={motion.circle}
						cx='44'
						cy='44'
						r={r}
						fill='none'
						strokeWidth='8'
						strokeLinecap='round'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: percent / 100 }}
						transition={{
							duration: 1.4,
							delay: 0.2,
							ease: [0.22, 1, 0.36, 1],
						}}
						sx={{ stroke: (theme) => theme.palette.success.main }}
					/>
				</svg>
				<Typography
					sx={{
						position: "absolute",
						inset: 0,
						display: "grid",
						placeItems: "center",
						fontWeight: 800,
						fontSize: "1.3rem",
					}}
				>
					<Counter to={percent} delay={0.2} suffix='%' />
				</Typography>
			</Box>
			<Typography sx={{ fontWeight: 800 }}>
				<span className='qa-latin'>9</span> من{" "}
				<span className='qa-latin'>10</span> صحيحة
			</Typography>
			<Badge tone='primary' delay={1.6}>
				أفضل نتيجة <span className='qa-latin'>90%</span>
			</Badge>
		</Box>
	);
}

/** 5. Result: the score ring fills, the percentage counts up, best score pops. */
export function ResultScene() {
	return (
		<Stage>
			<ScoreCard />
		</Stage>
	);
}

/** 1. Locked: the unit behind its price, the lock rattling. */
export function LockedScene() {
	return (
		<Stage>
			<LockedCard />
		</Stage>
	);
}

/** 3. Watch: the opened unit's video playing. */
export function WatchScene() {
	return (
		<Stage>
			<WatchCard />
		</Stage>
	);
}

/** The unit, locked behind its price. */
function LockedCard() {
	return (
		<Box sx={[cardSx(210), { textAlign: "center" }]}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<FolderRoundedIcon sx={{ color: "primary.main" }} />
				<Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
					الوحدة الأولى
				</Typography>
			</Box>
			<motion.div
				animate={{ rotate: [0, -12, 12, -8, 0] }}
				transition={{ duration: 0.6, delay: 0.4, repeat: 2, repeatDelay: 0.3 }}
				style={{ display: "inline-grid", margin: "10px 0 4px" }}
			>
				<LockRoundedIcon sx={{ fontSize: 44, color: "text.secondary" }} />
			</motion.div>
			<Typography sx={{ fontWeight: 800, color: "primary.main" }}>
				<span className='qa-latin'>25</span> ₪ · للمشتركين
			</Typography>
		</Box>
	);
}

/** The opened unit's video playing, its watch bar filling. */
function WatchCard() {
	return (
		<Box
			sx={(theme) => ({
				position: "relative",
				width: 220,
				aspectRatio: "16 / 9",
				display: "grid",
				placeItems: "center",
				overflow: "hidden",
				color: "common.white",
				borderRadius: `${theme.tokens.radii.md}px`,
				backgroundImage: theme.tokens.gradients.accent,
				boxShadow: theme.tokens.shadows.medium,
			})}
		>
			<Box sx={{ position: "absolute", top: 8, insetInlineStart: 8 }}>
				<Badge tone='success' delay={0.2}>
					<LockOpenRoundedIcon />
					مفتوحة لك
				</Badge>
			</Box>
			<motion.span
				animate={{ scale: [1, 1.12, 1] }}
				transition={{ duration: 1.2, repeat: Infinity }}
				style={{ display: "grid" }}
			>
				<PlayCircleOutlineRoundedIcon sx={{ fontSize: 48 }} />
			</motion.span>
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
					animate={{ width: "75%" }}
					transition={{ duration: 2.2, delay: 0.3, ease: "easeInOut" }}
					sx={{ height: "100%", backgroundColor: "#fff" }}
				/>
			</Box>
		</Box>
	);
}
