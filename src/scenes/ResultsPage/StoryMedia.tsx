"use client";
import { getYouTubeVideoID } from "@/libs/constant";
import { canOptimizeImage } from "@/libs/images";
import type { Story } from "@/libs/story";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, ButtonBase } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import StoryCarousel from "./StoryCarousel";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
	ssr: false,
});

const SIZES = "(max-width: 900px) 100vw, 640px";

const frameSx = (theme: Theme) => ({
	position: "relative" as const,
	overflow: "hidden",
	borderRadius: `${theme.tokens.radii.lg}px`,
	border: `1px solid ${theme.tokens.colors.border}`,
	backgroundColor: theme.tokens.colors.surfaceSecondary,
	boxShadow: `0 24px 60px -30px ${alpha(theme.tokens.colors.violet, 0.45)}`,
});

/** A story's YouTube video (opens in the player dialog) or its images. */
export default function StoryMedia({ story }: { story: Story }) {
	const videoId = story.youtubeUrl ? getYouTubeVideoID(story.youtubeUrl) : null;
	if (story.youtubeUrl && videoId)
		return (
			<StoryVideo url={story.youtubeUrl} id={videoId} title={story.title} />
		);
	if (story.images.length > 1)
		return <StoryCarousel images={story.images} title={story.title} />;
	if (story.images[0])
		return (
			<Box sx={frameSx}>
				<StoryImage src={story.images[0]} alt={story.title} />
			</Box>
		);
	return null;
}

/** Full width, natural height (nothing cropped). */
function StoryImage({ src, alt }: { src: string; alt: string }) {
	return (
		<Image
			src={src}
			alt={alt}
			width={1280}
			height={960}
			sizes={SIZES}
			unoptimized={!canOptimizeImage(src)}
			style={{ display: "block", width: "100%", height: "auto" }}
		/>
	);
}

function StoryVideo({
	url,
	id,
	title,
}: {
	url: string;
	id: string;
	title: string;
}) {
	const [open, setOpen] = useState(false);
	const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
	return (
		<>
			<ButtonBase
				onClick={() => setOpen(true)}
				aria-label={`تشغيل فيديو: ${title}`}
				sx={(theme) => ({
					...frameSx(theme),
					display: "block",
					width: "100%",
					aspectRatio: "16 / 9",
					"& img": {
						transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
					},
					"&:hover img": { transform: "scale(1.05)" },
					"&:hover .qa-play, &:focus-visible .qa-play": {
						transform: "scale(1.1)",
					},
				})}
			>
				<Image
					src={thumbnail}
					alt=''
					fill
					sizes={SIZES}
					unoptimized={!canOptimizeImage(thumbnail)}
					style={{ objectFit: "cover" }}
				/>
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)",
					}}
				/>
				<Box
					className='qa-play'
					aria-hidden
					sx={(theme) => ({
						// Centred without left/right (the RTL style plugin flips those).
						position: "absolute",
						inset: 0,
						m: "auto",
						transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
						display: "grid",
						placeItems: "center",
						width: { xs: 64, md: 80 },
						height: { xs: 64, md: 80 },
						borderRadius: "50%",
						color: "common.white",
						backgroundImage: theme.tokens.gradients.primary,
						boxShadow: `0 0 0 10px ${alpha(theme.palette.common.white, 0.18)}`,
						"& svg": { fontSize: { xs: 36, md: 44 } },
					})}
				>
					<PlayArrowRoundedIcon />
				</Box>
			</ButtonBase>
			<VideoPlayer
				open={open}
				handleClose={() => setOpen(false)}
				url={url}
				title={title}
			/>
		</>
	);
}
