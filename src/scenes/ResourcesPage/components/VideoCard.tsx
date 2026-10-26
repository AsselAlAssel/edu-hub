"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import Surface from "@/components/ui/Surface";
import { formatTime, type VideoProgress } from "@/hooks/useProgress";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import {
	Box,
	ButtonBase,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ResourceVideo } from "@/libs/class";
import type { Video } from "@prisma/client";
import Image from "next/image";
import { canOptimizeImage } from "@/libs/images";
import type { ReactNode } from "react";

// Bunny videos reach the client without videoId; their cards use the thumbnail route.
export const youtubeThumbnail = (
	video: Pick<Video, "videoId" | "thumbnailUrl">
) => {
	return video.videoId
		? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
		: video.thumbnailUrl;
};

export default function VideoCard({
	video,
	handle,
	onChangeName,
	onDelete,
	onPlay,
	isAdmin = false,
	onMove,
	progress,
	onToggleDone,
	locked = false,
}: {
	video: ResourceVideo;
	handle?: ReactNode;
	onChangeName: () => void;
	onDelete: () => void;
	onPlay: () => void;
	isAdmin?: boolean;
	onMove?: () => void;
	progress?: VideoProgress;
	/** Present for signed-in students: the manual "finished" toggle. */
	onToggleDone?: (completed: boolean) => void;
	/** Paid-unit video the student has not bought; `onPlay` opens the paywall. */
	locked?: boolean;
}) {
	const thumbnail = video.isBunny
		? `/api/video/${video.id}/thumbnail`
		: youtubeThumbnail(video);
	// A locked video reads as locked, even if it was finished before access ended.
	const done = !locked && !!progress?.completed;
	const badge = locked
		? "للمشتركين"
		: done
			? "مكتمل"
			: progress?.position
				? `تابع من ${formatTime(progress.position)}`
				: null;
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
				aria-label={
					locked
						? `فيديو للمشتركين: ${video.name}`
						: `تشغيل الفيديو: ${video.name}${badge ? ` (${badge})` : ""}`
				}
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
					src={thumbnail}
					unoptimized={video.isBunny || !canOptimizeImage(thumbnail)}
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
					{locked ? <LockOutlinedIcon /> : <PlayArrowRoundedIcon />}
				</Box>
				{badge ? (
					<Box
						component='span'
						aria-hidden
						sx={(theme) => ({
							position: "absolute",
							zIndex: 1,
							top: 10,
							insetInlineStart: 10,
							display: "inline-flex",
							alignItems: "center",
							gap: 0.5,
							px: 1,
							py: 0.25,
							borderRadius: `${theme.tokens.radii.full}px`,
							fontSize: "0.75rem",
							fontWeight: 700,
							color: theme.palette.common.white,
							backgroundColor: done
								? theme.palette.success.main
								: alpha(theme.palette.common.black, 0.65),
							"& svg": { fontSize: 14 },
						})}
					>
						{done ? <CheckCircleRoundedIcon /> : null}
						{badge}
					</Box>
				) : null}
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
				{onToggleDone ? (
					<Tooltip title={done ? "إلغاء علامة الإنهاء" : "علّمته كمكتمل"}>
						<IconButton
							size='small'
							aria-label={`أنهيت الفيديو: ${video.name}`}
							aria-pressed={done}
							onClick={() => onToggleDone(!done)}
							sx={{ color: done ? "success.main" : "text.secondary", mt: -0.5 }}
						>
							{done ? (
								<CheckCircleRoundedIcon />
							) : (
								<RadioButtonUncheckedRoundedIcon />
							)}
						</IconButton>
					</Tooltip>
				) : null}
			</Stack>
		</Surface>
	);
}
