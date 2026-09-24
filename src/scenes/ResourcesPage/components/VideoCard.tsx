"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import Surface from "@/components/ui/Surface";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Video } from "@prisma/client";
import Image from "next/image";
import type { ReactNode } from "react";

export const youtubeThumbnail = (
	video: Pick<Video, "videoId" | "thumbnailUrl">
) =>
	video.videoId
		? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
		: video.thumbnailUrl;

export default function VideoCard({
	video,
	handle,
	onChangeName,
	onDelete,
	onPlay,
	isAdmin = false,
	onMove,
}: {
	video: Video;
	handle?: ReactNode;
	onChangeName: () => void;
	onDelete: () => void;
	onPlay: () => void;
	isAdmin?: boolean;
	onMove?: () => void;
}) {
	return (
		<Surface
			interactive
			component='article'
			data-testid='video-card'
			sx={{
				height: "100%",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<ButtonBase
				onClick={onPlay}
				aria-label={`تشغيل الفيديو: ${video.name}`}
				sx={(theme) => ({
					position: "relative",
					display: "block",
					width: "100%",
					aspectRatio: "16 / 9",
					overflow: "hidden",
					backgroundColor: theme.tokens.colors.surfaceSecondary,
					"& img": {
						transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
					},
					// Legibility + depth: darken toward the bottom edge.
					"&::after": {
						content: '""',
						position: "absolute",
						inset: 0,
						background: `linear-gradient(to top, ${alpha(theme.tokens.colors.bg, 0.7)}, transparent 55%)`,
						pointerEvents: "none",
					},
					"&:hover img": { transform: "scale(1.06)" },
					"&:hover .qa-play, &.Mui-focusVisible .qa-play": {
						transform: "scale(1.1)",
						backgroundImage: theme.tokens.gradients.primary,
						color: theme.palette.primary.contrastText,
						boxShadow: theme.tokens.shadows.glow,
					},
					"&.Mui-focusVisible": {
						outline: `3px solid ${theme.palette.primary.main}`,
						outlineOffset: -3,
					},
				})}
			>
				<Image
					src={youtubeThumbnail(video)}
					alt=''
					fill
					sizes='(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 300px'
					style={{ objectFit: "cover" }}
				/>
				<Box
					className='qa-play'
					aria-hidden
					sx={(theme) => ({
						position: "absolute",
						zIndex: 1,
						top: "50%",
						left: "50%",
						width: 54,
						height: 54,
						marginTop: "-27px",
						marginLeft: "-27px",
						backdropFilter: "blur(6px)",
						borderRadius: "50%",
						display: "grid",
						placeItems: "center",
						color: theme.palette.common.white,
						backgroundColor: alpha(theme.palette.common.black, 0.6),
						border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
						transition: theme.transitions.create([
							"transform",
							"background-color",
							"color",
							"box-shadow",
						]),
						"& svg": { fontSize: 30 },
					})}
				>
					<PlayArrowRoundedIcon />
				</Box>
			</ButtonBase>
			<Stack
				direction='row'
				alignItems='flex-start'
				gap={1}
				sx={{ p: 1.75, flex: 1 }}
			>
				<Typography
					variant='subtitle2'
					component='h3'
					sx={{
						flex: 1,
						minWidth: 0,
						fontSize: "1rem",
						fontWeight: 600,
						lineHeight: 1.65,
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{video.name}
				</Typography>
				{isAdmin ? (
					<Stack direction='row' gap={0.75}>
						{handle}
						<ActionsMenu
							label={`خيارات الفيديو: ${video.name}`}
							editLabel='إعادة تسمية الفيديو'
							deleteLabel='حذف الفيديو'
							onEdit={onChangeName}
							onDelete={onDelete}
							onMove={onMove}
						/>
					</Stack>
				) : null}
			</Stack>
		</Surface>
	);
}
