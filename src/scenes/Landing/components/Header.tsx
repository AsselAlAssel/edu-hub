"use client";
import type { PlatformStats } from "@/actions/landing";
import PageContainer from "@/components/PageContainer";
import { usePointerParallax } from "@/components/ui/motion";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import HeroVisual from "./HeroVisual";

type HeroProps = {
	headerTitle?: string;
	headerSubtitle?: string | null;
	headerImage?: string | null;
	stats?: PlatformStats | null;
	isVideoExist?: boolean;
	/** CMS preview: renders an h2 and skips LCP image priority. */
	preview?: boolean;
};

const DEFAULT_SUBTITLE =
	"شروحات فيديو وملفات دراسية منظّمة لكل صف من إعداد الأستاذ محمد صبح، تساعدك على فهم المفاهيم الفيزيائية بعمق بدل حفظها.";

/**
 * Headline with its closing phrase in the cyan → blue gradient. CMS titles
 * keep their text; the last one or two words become the highlight.
 */
function Headline({ title }: { title?: string }) {
	if (!title?.trim())
		return (
			<>
				افهم الفيزياء <span className='qa-gradient-text'>بطريقة مختلفة</span>
			</>
		);
	const words = title.trim().split(/\s+/);
	if (words.length < 3)
		return <span className='qa-gradient-text'>{title}</span>;
	const cut = words.length - Math.min(2, Math.floor(words.length / 2));
	return (
		<>
			{words.slice(0, cut).join(" ")}{" "}
			<span className='qa-gradient-text'>{words.slice(cut).join(" ")}</span>
		</>
	);
}

function Stats({ stats }: { stats?: PlatformStats | null }) {
	const items = [
		{ value: stats?.classes ?? 0, label: "صفوف دراسية" },
		{ value: stats?.videos ?? 0, label: "فيديو شرح" },
		{ value: stats?.files ?? 0, label: "ملف دراسي" },
	].filter((item) => item.value > 0);
	if (!items.length) return null;

	return (
		<Box
			component='dl'
			sx={(theme) => ({
				display: "flex",
				flexWrap: "wrap",
				justifyContent: { xs: "center", md: "flex-start" },
				gap: { xs: 3, sm: 5 },
				m: 0,
				pt: 3,
				mt: 1,
				borderTop: `1px solid ${theme.tokens.colors.border}`,
				width: { xs: "100%", md: "auto" },
			})}
		>
			{items.map((item) => (
				<Box
					key={item.label}
					sx={{ display: "flex", flexDirection: "column-reverse" }}
				>
					<Typography
						component='dt'
						sx={{
							color: "text.secondary",
							fontSize: "0.875rem",
							fontWeight: 500,
						}}
					>
						{item.label}
					</Typography>
					<Typography
						component='dd'
						className='qa-gradient-text qa-latin'
						sx={{
							m: 0,
							fontWeight: 700,
							fontSize: { xs: "1.75rem", md: "2.125rem" },
							lineHeight: 1.2,
						}}
					>
						{item.value}+
					</Typography>
				</Box>
			))}
		</Box>
	);
}

// CSS entrance (runs before hydration, so the LCP headline is never held back
// by JavaScript). Children rise in sequence; reduced motion collapses it.
const rise = (index: number) => ({
	animation: `qaRise 700ms cubic-bezier(0.22, 1, 0.36, 1) ${80 + index * 90}ms both`,
});
/** Landing hero: two-column composition — copy on the right, visual on the left (RTL). */
export default function Header({
	headerTitle,
	headerSubtitle,
	headerImage,
	stats,
	preview = false,
}: HeroProps) {
	const areaRef = useRef<HTMLDivElement>(null);
	const { x: px, y: py } = usePointerParallax(areaRef);
	const glowX = useTransform(px, (v) => `${v * 30}%`);
	const glowY = useTransform(py, (v) => `${v * 30}%`);

	return (
		<Box
			ref={areaRef}
			sx={(theme) => {
				const { colors } = theme.tokens;
				return {
					position: "relative",
					overflow: "hidden",
					isolation: "isolate",
					display: "flex",
					alignItems: "center",
					minHeight: preview
						? "auto"
						: { md: `calc(100svh - ${theme.tokens.layout.headerHeight}px)` },
					py: { xs: 6, md: 8 },
					// Light grid, masked to the centre.
					"&::before": {
						content: '""',
						position: "absolute",
						inset: 0,
						zIndex: -2,
						backgroundImage: `linear-gradient(${alpha(colors.cyan, 0.07)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(colors.cyan, 0.07)} 1px, transparent 1px)`,
						backgroundSize: "64px 64px",
						maskImage:
							"radial-gradient(ellipse 75% 70% at 50% 45%, #000 25%, transparent 78%)",
						WebkitMaskImage:
							"radial-gradient(ellipse 75% 70% at 50% 45%, #000 25%, transparent 78%)",
					},
					// Fade into the next section.
					"&::after": {
						content: '""',
						position: "absolute",
						insetInline: 0,
						bottom: 0,
						height: 120,
						zIndex: -1,
						pointerEvents: "none",
						background: `linear-gradient(to bottom, transparent, ${colors.bg})`,
					},
					"@keyframes qaRise": {
						from: { opacity: 0, transform: "translateY(22px)" },
						to: { opacity: 1, transform: "none" },
					},
				};
			}}
		>
			{/* Ambient orbs + pointer spotlight (decorative). */}
			<Box
				aria-hidden
				sx={(theme) => ({
					position: "absolute",
					inset: 0,
					zIndex: -2,
					pointerEvents: "none",
					background: `radial-gradient(38% 45% at 22% 40%, ${alpha(theme.tokens.colors.cyan, 0.16)}, transparent 70%), radial-gradient(30% 40% at 85% 10%, ${alpha(theme.tokens.colors.violet, 0.16)}, transparent 70%), radial-gradient(25% 30% at 70% 95%, ${alpha(theme.tokens.colors.amber, 0.07)}, transparent 70%)`,
				})}
			/>
			<motion.div
				aria-hidden
				style={{
					x: glowX,
					y: glowY,
					position: "absolute",
					top: "10%",
					left: "20%",
					width: "60%",
					aspectRatio: "1 / 1",
					zIndex: -1,
					pointerEvents: "none",
					borderRadius: "50%",
					background:
						"radial-gradient(closest-side, color-mix(in srgb, var(--qa-azure) 14%, transparent), transparent)",
				}}
			/>

			<PageContainer>
				<Box
					sx={{
						display: "grid",
						alignItems: "center",
						gap: { xs: 5, md: 4 },
						gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
					}}
				>
					<Stack
						spacing={3}
						alignItems={{ xs: "center", md: "flex-start" }}
						textAlign={{ xs: "center", md: "start" }}
						sx={{ position: "relative", zIndex: 1 }}
					>
						<Box
							sx={(theme) => ({
								...rise(0),
								display: "inline-flex",
								alignItems: "center",
								gap: 1.25,
								px: 2,
								py: 0.75,
								borderRadius: `${theme.tokens.radii.full}px`,
								border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.45)}`,
								backgroundColor: alpha(theme.tokens.colors.cyan, 0.1),
								boxShadow:
									theme.palette.mode === "dark"
										? `0 0 24px ${alpha(theme.tokens.colors.cyan, 0.18)}`
										: "none",
								color:
									theme.palette.mode === "dark"
										? "primary.light"
										: "primary.main",
								fontWeight: 600,
								fontSize: "0.9375rem",
							})}
						>
							<Box
								aria-hidden
								sx={(theme) => ({
									width: 8,
									height: 8,
									borderRadius: "50%",
									bgcolor: theme.tokens.colors.cyan,
									boxShadow: `0 0 0 4px ${alpha(theme.tokens.colors.cyan, 0.2)}`,
									animation: "qaPing 2.4s ease-in-out infinite",
									"@keyframes qaPing": {
										"50%": {
											boxShadow: `0 0 0 8px ${alpha(theme.tokens.colors.cyan, 0)}`,
										},
									},
								})}
							/>
							منصة الفيزياء التعليمية
						</Box>

						<Typography
							variant='h1'
							component={preview ? "h2" : "h1"}
							sx={{
								// Fades in: the Arabic web font swaps in at ~250ms, and a
								// still-transparent headline keeps that reflow out of CLS.
								...rise(1),
								fontSize: {
									xs: "2.625rem",
									sm: "3.5rem",
									md: "clamp(3.5rem, 5.4vw, 5rem)",
								},
								fontWeight: 700,
								lineHeight: 1.25,
								maxWidth: 680,
								textWrap: "balance",
							}}
						>
							<Headline title={headerTitle} />
						</Typography>

						<Typography
							variant='subtitle1'
							component='p'
							sx={{
								...rise(2),
								color: "text.secondary",
								maxWidth: 560,
								fontSize: { xs: "1.0625rem", md: "1.25rem" },
								lineHeight: 1.9,
								textWrap: "pretty",
							}}
						>
							{headerSubtitle || DEFAULT_SUBTITLE}
						</Typography>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							gap={1.5}
							sx={{ ...rise(3), width: { xs: "100%", sm: "auto" }, pt: 1 }}
						>
							<Button
								component={Link}
								href='/classes'
								size='large'
								endIcon={<ArrowBackRoundedIcon />}
								sx={{
									"& .MuiButton-endIcon": {
										transition: "transform 200ms ease",
									},
									"&:hover .MuiButton-endIcon": {
										transform: "translateX(-4px)",
									},
								}}
							>
								استكشف الصفوف
							</Button>
							<Button
								component={Link}
								href='/#about'
								size='large'
								variant='outlined'
							>
								تعرف علينا
							</Button>
						</Stack>

						<Box sx={{ ...rise(4), width: { xs: "100%", md: "auto" } }}>
							<Stats stats={stats} />
						</Box>
					</Stack>

					<Box sx={{ px: { xs: 3, sm: 6, md: 0 } }}>
						<HeroVisual
							px={px}
							py={py}
							image={headerImage}
							stats={stats}
							preview={preview}
						/>
					</Box>
				</Box>
			</PageContainer>
		</Box>
	);
}
