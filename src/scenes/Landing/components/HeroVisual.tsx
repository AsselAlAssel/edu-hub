"use client";
import type { PlatformStats } from "@/actions/landing";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, Stack, Typography } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** One parallax plane: moves opposite the pointer by `depth` px. */
function Layer({
	px,
	py,
	depth,
	delay,
	children,
	sx,
}: {
	px: MotionValue<number>;
	py: MotionValue<number>;
	depth: number;
	delay: number;
	children: ReactNode;
	sx: object;
}) {
	const x = useTransform(px, (v) => v * -depth);
	const y = useTransform(py, (v) => v * -depth);
	return (
		<Box sx={{ position: "absolute", ...sx }}>
			{/* Outer node: pointer parallax. Inner node: entrance. */}
			<motion.div style={{ x, y }}>
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 16 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay }}
				>
					{children}
				</motion.div>
			</motion.div>
		</Box>
	);
}

const glassChip = (theme: Theme) => ({
	display: "inline-flex",
	alignItems: "center",
	gap: 1,
	px: 1.75,
	py: 1,
	borderRadius: `${theme.tokens.radii.md}px`,
	border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.3)}`,
	backgroundColor: alpha(
		theme.tokens.colors.surfaceElevated,
		theme.palette.mode === "dark" ? 0.78 : 0.92
	),
	backdropFilter: "blur(10px)",
	boxShadow: theme.tokens.shadows.medium,
	whiteSpace: "nowrap" as const,
});

// Gentle bob on an inner node so it never fights the parallax transform.
const float = (seconds: number, delay = 0) => ({
	animation: `qaFloat ${seconds}s ease-in-out ${delay}s infinite`,
	"@keyframes qaFloat": {
		"0%, 100%": { transform: "translateY(0)" },
		"50%": { transform: "translateY(-10px)" },
	},
});

function Formula({
	children,
	tone,
}: {
	children: string;
	tone: "cyan" | "violet" | "amber";
}) {
	return (
		<Box
			className='qa-latin'
			lang='en'
			dir='ltr'
			sx={(theme) => ({
				...glassChip(theme),
				fontFamily: "var(--qa-font-latin), ui-monospace, monospace",
				fontWeight: 700,
				fontSize: { xs: "0.875rem", md: "1rem" },
				color: theme.tokens.colors[tone],
				borderColor: alpha(theme.tokens.colors[tone], 0.4),
			})}
		>
			{children}
		</Box>
	);
}

/** Atom: nucleus + three tilted orbits, each carrying one electron. */
function Atom({ size }: { size: number | string }) {
	return (
		<Box
			component='svg'
			viewBox='-100 -100 200 200'
			aria-hidden
			sx={{
				width: size,
				height: size,
				overflow: "visible",
				"& .qa-orbit": {
					transformBox: "view-box",
					transformOrigin: "0 0",
					animation: "qaSpin 14s linear infinite",
				},
				"& .qa-orbit:nth-of-type(2)": { animationDuration: "18s" },
				"& .qa-orbit:nth-of-type(3)": {
					animationDuration: "22s",
					animationDirection: "reverse",
				},
				"@keyframes qaSpin": { to: { rotate: "360deg" } },
			}}
		>
			<defs>
				<radialGradient id='qa-nucleus'>
					<stop offset='0%' stopColor='var(--qa-text-primary)' />
					<stop offset='45%' stopColor='var(--qa-cyan)' />
					<stop offset='100%' stopColor='var(--qa-cyan)' stopOpacity='0' />
				</radialGradient>
			</defs>
			{[0, 60, 120].map((tilt, i) => (
				<g key={tilt} transform={`rotate(${tilt})`}>
					<g className='qa-orbit'>
						<ellipse
							rx='88'
							ry='30'
							fill='none'
							stroke={i === 1 ? "var(--qa-violet)" : "var(--qa-cyan)"}
							strokeOpacity='0.55'
							strokeWidth='1.4'
						/>
						<circle
							cx='88'
							cy='0'
							r='5'
							fill={i === 1 ? "var(--qa-violet)" : "var(--qa-azure)"}
						/>
					</g>
				</g>
			))}
			<circle r='30' fill='url(#qa-nucleus)' opacity='0.55' />
			<circle r='11' fill='var(--qa-cyan)' />
		</Box>
	);
}

/** Wave lab panel: a travelling sine wave with its wave equation. */
// Two wavelengths of sine; translating by one wavelength loops seamlessly.
// Rounded: Math.sin's last digits differ between Node and browsers, and an
// unrounded path breaks hydration (server/client `d` mismatch).
const WAVE_PATH = Array.from({ length: 97 }, (_, i) => {
	const x = i * 5;
	const y = 30 - Math.sin((x / 240) * Math.PI * 2) * 18;
	return `${i ? "L" : "M"}${x} ${y.toFixed(2)}`;
}).join(" ");

function WavePanel() {
	const wave = WAVE_PATH;
	return (
		<Box
			sx={(theme) => ({
				...glassChip(theme),
				display: "block",
				width: { xs: 158, sm: 236 },
				p: { xs: 1.25, sm: 1.75 },
				whiteSpace: "normal",
			})}
		>
			<Stack
				direction='row'
				justifyContent='space-between'
				alignItems='center'
				mb={1}
			>
				<Typography
					sx={{ fontSize: "0.8125rem", fontWeight: 600, color: "text.primary" }}
				>
					مختبر الموجات
				</Typography>
				<Box
					aria-hidden
					sx={(theme) => ({
						width: 8,
						height: 8,
						borderRadius: "50%",
						bgcolor: theme.tokens.colors.success,
						boxShadow: `0 0 10px ${theme.tokens.colors.success}`,
						animation: "qaPulse 2s ease-in-out infinite",
						"@keyframes qaPulse": { "50%": { opacity: 0.35 } },
					})}
				/>
			</Stack>
			<Box
				sx={(theme) => ({
					height: 60,
					overflow: "hidden",
					borderRadius: `${theme.tokens.radii.sm}px`,
					backgroundColor: alpha(theme.tokens.colors.bg, 0.55),
					backgroundImage: `linear-gradient(${alpha(theme.tokens.colors.cyan, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.tokens.colors.cyan, 0.08)} 1px, transparent 1px)`,
					backgroundSize: "20px 20px",
				})}
			>
				<Box
					component='svg'
					viewBox='0 0 480 60'
					preserveAspectRatio='none'
					sx={{
						display: "block",
						width: "200%",
						height: "100%",
						animation: "qaWave 3.2s linear infinite",
						"@keyframes qaWave": { to: { transform: "translateX(-50%)" } },
					}}
				>
					<path
						d={wave}
						fill='none'
						stroke='var(--qa-cyan)'
						strokeWidth='2.5'
					/>
				</Box>
			</Box>
			<Stack direction='row' justifyContent='space-between' mt={1}>
				<Typography
					className='qa-latin'
					lang='en'
					dir='ltr'
					sx={{ fontSize: "0.8125rem", fontWeight: 700, color: "primary.main" }}
				>
					v = λ · f
				</Typography>
				<Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
					سرعة الموجة
				</Typography>
			</Stack>
		</Box>
	);
}

function ResourceChip({
	icon,
	label,
	tone,
}: {
	icon: ReactNode;
	label: string;
	tone: "cyan" | "violet";
}) {
	return (
		<Box sx={glassChip}>
			<Box
				aria-hidden
				sx={(theme) => ({
					display: "grid",
					placeItems: "center",
					width: 30,
					height: 30,
					borderRadius: `${theme.tokens.radii.sm}px`,
					color:
						theme.palette.mode === "dark" ? theme.tokens.colors.bg : "#fff",
					backgroundImage:
						tone === "cyan"
							? theme.tokens.gradients.primary
							: theme.tokens.gradients.accent,
					"& svg": { fontSize: 18 },
				})}
			>
				{icon}
			</Box>
			<Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
				{label}
			</Typography>
		</Box>
	);
}

/**
 * Layered hero composition: orbit field, centre piece (CMS image or atom),
 * wave panel, formula chips and real resource counts — each on its own
 * parallax plane. Purely decorative except the CMS image (which has alt).
 */
export default function HeroVisual({
	px,
	py,
	image,
	stats,
	preview,
}: {
	px: MotionValue<number>;
	py: MotionValue<number>;
	image?: string | null;
	stats?: PlatformStats | null;
	preview?: boolean;
}) {
	const videos = stats?.videos ?? 0;
	const files = stats?.files ?? 0;

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				maxWidth: 560,
				mx: "auto",
				aspectRatio: "1 / 1",
			}}
		>
			{/* Orbit field + glow: the deepest plane. */}
			<Layer px={px} py={py} depth={8} delay={0} sx={{ inset: 0 }}>
				<Box
					aria-hidden
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "1 / 1",
						borderRadius: "50%",
						background: `radial-gradient(circle at 50% 50%, ${alpha(theme.tokens.colors.cyan, 0.22)} 0%, ${alpha(theme.tokens.colors.violet, 0.12)} 38%, transparent 68%)`,
						"& > span": {
							position: "absolute",
							borderRadius: "50%",
							border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.22)}`,
						},
					})}
				>
					<Box component='span' sx={{ inset: "6%" }} />
					<Box
						component='span'
						sx={(theme) => ({
							inset: "20%",
							borderStyle: "dashed !important",
							borderColor: `${alpha(theme.tokens.colors.violet, 0.35)} !important`,
							animation: "qaSpin 60s linear infinite",
							"@keyframes qaSpin": { to: { rotate: "360deg" } },
						})}
					/>
					<Box component='span' sx={{ inset: "33%" }} />
				</Box>
			</Layer>

			{/* Centre piece. */}
			<Layer
				px={px}
				py={py}
				depth={16}
				delay={0.1}
				sx={{ inset: image ? "17%" : "16%" }}
			>
				{image ? (
					<Box
						sx={(theme) => ({
							position: "relative",
							width: "100%",
							aspectRatio: "1 / 1",
							borderRadius: `${theme.tokens.radii.xl + 6}px`,
							overflow: "hidden",
							border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.4)}`,
							boxShadow: `${theme.tokens.shadows.strong}, 0 0 60px ${alpha(theme.tokens.colors.cyan, 0.25)}`,
							backgroundColor: theme.tokens.colors.surfaceSecondary,
						})}
					>
						<Image
							src={image}
							alt='الأستاذ محمد صبح — شروحات الفيزياء'
							fill
							priority={!preview}
							sizes='(max-width: 900px) 70vw, 380px'
							style={{ objectFit: "cover" }}
						/>
					</Box>
				) : (
					<Box sx={{ ...float(7) }}>
						<Atom size='100%' />
					</Box>
				)}
			</Layer>

			{image ? (
				<Layer
					px={px}
					py={py}
					depth={26}
					delay={0.25}
					sx={{ top: "0%", insetInlineEnd: "2%" }}
				>
					<Box sx={{ ...float(8, 0.5), width: { xs: 88, sm: 118 } }}>
						<Atom size='100%' />
					</Box>
				</Layer>
			) : null}

			<Layer
				px={px}
				py={py}
				depth={30}
				delay={0.3}
				sx={{ top: "8%", insetInlineStart: "0%" }}
			>
				<Box sx={float(6)}>
					<Formula tone='cyan'>F = m · a</Formula>
				</Box>
			</Layer>

			<Layer
				px={px}
				py={py}
				depth={22}
				delay={0.4}
				sx={{ top: "46%", insetInlineEnd: "-2%" }}
			>
				<Box sx={float(7, 1)}>
					<Formula tone='amber'>E = m · c²</Formula>
				</Box>
			</Layer>

			<Layer
				px={px}
				py={py}
				depth={36}
				delay={0.5}
				sx={{ bottom: { xs: "-4%", sm: "2%" }, insetInlineStart: "-2%" }}
			>
				<WavePanel />
			</Layer>

			{videos > 0 || files > 0 ? (
				<Layer
					px={px}
					py={py}
					depth={28}
					delay={0.6}
					sx={{
						bottom: "12%",
						insetInlineEnd: "0%",
						display: { xs: "none", sm: "block" },
					}}
				>
					<Stack spacing={1.25} sx={float(8, 0.8)}>
						{videos > 0 ? (
							<ResourceChip
								tone='cyan'
								icon={<PlayArrowRoundedIcon />}
								label={`${videos} فيديو شرح`}
							/>
						) : null}
						{files > 0 ? (
							<ResourceChip
								tone='violet'
								icon={<DescriptionRoundedIcon />}
								label={`${files} ملف دراسي`}
							/>
						) : null}
					</Stack>
				</Layer>
			) : null}
		</Box>
	);
}
