"use client";
import { Reveal } from "@/components/ui/motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, ButtonBase } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { useState } from "react";

/**
 * YouTube facade: shows the thumbnail until the visitor presses play, so the
 * ~1MB player (and its cookies) never load on page view.
 */
export function LiteYouTube({
	videoId,
	title,
}: {
	videoId: string;
	title: string;
}) {
	const [playing, setPlaying] = useState(false);

	return (
		<Box
			sx={(theme) => ({
				position: "relative",
				aspectRatio: "16 / 9",
				borderRadius: `${theme.tokens.radii.xl}px`,
				overflow: "hidden",
				border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.3)}`,
				boxShadow:
					theme.palette.mode === "dark"
						? `${theme.tokens.shadows.strong}, 0 0 80px ${alpha(theme.tokens.colors.cyan, 0.14)}`
						: theme.tokens.shadows.medium,
				backgroundColor: theme.tokens.colors.surfaceSecondary,
				"& img": {
					transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
				},
				"&:hover img": { transform: "scale(1.03)" },
			})}
		>
			{playing ? (
				<Box
					component='iframe'
					src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
					title={title}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					referrerPolicy='strict-origin-when-cross-origin'
					allowFullScreen
					sx={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						border: 0,
					}}
				/>
			) : (
				<ButtonBase
					onClick={() => setPlaying(true)}
					aria-label={`تشغيل الفيديو: ${title}`}
					sx={(theme) => ({
						position: "absolute",
						inset: 0,
						"&:hover .qa-play, &.Mui-focusVisible .qa-play": {
							backgroundColor: theme.palette.primary.main,
							color: theme.palette.primary.contrastText,
							transform: "scale(1.08)",
						},
						"&.Mui-focusVisible": {
							outline: `3px solid ${theme.palette.primary.main}`,
							outlineOffset: -3,
						},
					})}
				>
					<Image
						src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
						alt=''
						fill
						sizes='(max-width: 900px) 100vw, 960px'
						style={{ objectFit: "cover" }}
					/>
					<Box
						className='qa-play'
						aria-hidden
						sx={(theme) => ({
							position: "relative",
							width: 76,
							height: 76,
							borderRadius: "50%",
							display: "grid",
							placeItems: "center",
							color: theme.palette.common.white,
							backgroundColor: alpha(theme.palette.common.black, 0.6),
							border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
							backdropFilter: "blur(6px)",
							transition: theme.transitions.create([
								"background-color",
								"color",
								"transform",
							]),
							"& svg": { fontSize: 40 },
							// Expanding ring invites the click (stops under reduced motion).
							"&::before": {
								content: '""',
								position: "absolute",
								inset: -1,
								borderRadius: "50%",
								border: `2px solid ${alpha(theme.tokens.colors.cyan, 0.7)}`,
								animation:
									"qaRing 2.2s cubic-bezier(0.22, 1, 0.36, 1) infinite",
							},
							"@keyframes qaRing": {
								from: { transform: "scale(1)", opacity: 1 },
								to: { transform: "scale(1.6)", opacity: 0 },
							},
						})}
					>
						<PlayArrowRoundedIcon />
					</Box>
				</ButtonBase>
			)}
		</Box>
	);
}

export default function VideoSection({ videoId }: { videoId: string }) {
	return (
		<Section id='video' tone='muted' aria-labelledby='video-title'>
			<SectionHeader
				titleId='video-title'
				eyebrow='فيديو تعريفي'
				title='تعرّف على طريقة الشرح'
				description='شاهد مقطعاً قصيراً قبل أن تبدأ رحلتك مع الصفوف.'
			/>
			<Reveal>
				<Box sx={{ maxWidth: 960, mx: "auto" }}>
					<LiteYouTube
						videoId={videoId}
						title='الفيديو التعريفي لمنصة محمد صبح'
					/>
				</Box>
			</Reveal>
		</Section>
	);
}
