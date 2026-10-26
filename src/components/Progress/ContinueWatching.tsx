"use client";
import useProgress, {
	formatTime,
	inProgress,
	watchUrl,
} from "@/hooks/useProgress";
import useRole from "@/hooks/useRole";
import { youtubeThumbnail } from "@/scenes/ResourcesPage/components/VideoCard";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, IconButton, Slide, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "continue-dismissed";

/**
 * Floating "continue watching" card for the last unfinished video. Fixed to
 * the corner so appearing after load never shifts the page (CLS); closing it
 * hides that video's card for the rest of the browser session.
 */
export default function ContinueWatching() {
	const { isAdmin } = useRole();
	const { items } = useProgress();
	const [dismissed, setDismissed] = useState<string | null>(null);

	useEffect(() => {
		try {
			setDismissed(sessionStorage.getItem(DISMISSED_KEY));
		} catch {
			// Storage blocked: the card just can't remember being closed.
		}
	}, []);

	const next = isAdmin ? undefined : inProgress(items)[0];
	const show = !!next && next.videoId !== dismissed;

	const dismiss = () => {
		if (!next) return;
		setDismissed(next.videoId);
		try {
			sessionStorage.setItem(DISMISSED_KEY, next.videoId);
		} catch {
			// See above.
		}
	};

	return (
		<Slide direction='up' in={show} mountOnEnter unmountOnExit>
			<Box
				component='aside'
				aria-label='تابع المشاهدة'
				sx={(theme) => ({
					position: "fixed",
					zIndex: theme.zIndex.speedDial,
					bottom: theme.spacing(3),
					insetInlineStart: theme.spacing(2),
					width: "min(340px, calc(100vw - 32px))",
					p: 1,
					borderRadius: `${theme.tokens.radii.lg}px`,
					border: `1px solid ${theme.tokens.colors.border}`,
					backgroundColor: theme.tokens.colors.surfaceElevated,
					boxShadow: theme.tokens.shadows.strong,
				})}
			>
				{next ? (
					<Stack direction='row' alignItems='center' gap={1.25}>
						<Box
							component={Link}
							href={watchUrl(next)}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.25,
								flex: 1,
								minWidth: 0,
								color: "inherit",
								textDecoration: "none",
							}}
						>
							<Box
								sx={(theme) => ({
									position: "relative",
									flexShrink: 0,
									width: 96,
									aspectRatio: "16 / 9",
									overflow: "hidden",
									borderRadius: `${theme.tokens.radii.sm}px`,
									backgroundColor: theme.tokens.colors.surfaceSecondary,
								})}
							>
								{next.youtubeId ? (
									<Image
										src={youtubeThumbnail({
											videoId: next.youtubeId,
											thumbnailUrl: "",
										})}
										unoptimized
										alt=''
										fill
										sizes='96px'
										style={{ objectFit: "cover" }}
									/>
								) : null}
								<Box
									aria-hidden
									sx={{
										position: "absolute",
										inset: 0,
										display: "grid",
										placeItems: "center",
										color: "common.white",
										backgroundColor: "rgba(0,0,0,0.35)",
									}}
								>
									<PlayArrowRoundedIcon />
								</Box>
							</Box>
							<Box sx={{ minWidth: 0 }}>
								<Typography
									variant='caption'
									sx={{ color: "primary.main", fontWeight: 700 }}
								>
									تابع من {formatTime(next.position)}
								</Typography>
								<Typography
									sx={{
										fontSize: "0.875rem",
										fontWeight: 600,
										lineHeight: 1.5,
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}
								>
									{next.name}
								</Typography>
							</Box>
						</Box>
						<IconButton
							size='small'
							onClick={dismiss}
							aria-label='إخفاء'
							sx={{ alignSelf: "flex-start" }}
						>
							<CloseRoundedIcon fontSize='small' />
						</IconButton>
					</Stack>
				) : null}
			</Box>
		</Slide>
	);
}
