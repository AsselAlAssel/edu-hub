"use client";
import AppDialog from "@/components/ui/AppDialog";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// The YouTube-only build of react-player, loaded only when a video is opened.
const ReactPlayer = dynamic(() => import("react-player/youtube"), {
	ssr: false,
	loading: () => (
		<Box
			sx={{
				position: "absolute",
				inset: 0,
				display: "grid",
				placeItems: "center",
			}}
		>
			<CircularProgress aria-label='جارٍ تحميل المشغّل' />
		</Box>
	),
});

/** Marks the history entry pushed while the player is open. */
const HISTORY_KEY = "__videoPlayer";
const onPlayerEntry = () => Boolean(window.history.state?.[HISTORY_KEY]);

export default function VideoPlayer({
	open,
	handleClose,
	url,
	title = "مشغّل الفيديو",
	startAt = 0,
	onProgress,
}: {
	open: boolean;
	handleClose: () => void;
	url: string;
	title?: string;
	/** Second to resume from. */
	startAt?: number;
	/** Called every second while playing: (playedSeconds, duration). */
	onProgress?: (playedSeconds: number, duration: number) => void;
}) {
	const duration = useRef(0);
	const boxRef = useRef<HTMLDivElement>(null);
	const close = useCloseOnBack(open, handleClose);

	return (
		<AppDialog
			open={open}
			onClose={close}
			title={title}
			maxWidth='md'
			fullScreenOnMobile={false}
		>
			<Stack spacing={1.5}>
				<Box
					ref={boxRef}
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "16 / 9",
						// Fit the viewport height too (phones in landscape).
						maxWidth: "calc((100dvh - 200px) * 16 / 9)",
						width: "100%",
						mx: "auto",
						borderRadius: `${theme.tokens.radii.md}px`,
						overflow: "hidden",
						backgroundColor: theme.palette.common.black,
						"&:fullscreen": { maxWidth: "none", borderRadius: 0 },
					})}
				>
					{/* Unmounted on close, which stops playback. */}
					{open && url ? (
						<ReactPlayer
							url={url}
							playing
							controls
							width='100%'
							height='100%'
							style={{ position: "absolute", inset: 0 }}
							config={{
								playerVars: { rel: 0, start: Math.floor(startAt) },
							}}
							onDuration={(seconds) => (duration.current = seconds)}
							onProgress={({ playedSeconds }) =>
								duration.current &&
								onProgress?.(playedSeconds, duration.current)
							}
						/>
					) : null}
				</Box>
				{/* Same button as the paid (Bunny) player, for one look. */}
				<Button
					size='small'
					startIcon={<FullscreenRoundedIcon />}
					onClick={() => void boxRef.current?.requestFullscreen?.()}
					sx={{ alignSelf: "flex-start" }}
				>
					ملء الشاشة
				</Button>
			</Stack>
		</AppDialog>
	);
}

/**
 * The device/browser back button closes a player dialog instead of leaving
 * the page: opening pushes a history entry (keeping Next's router state),
 * and every close goes back through it. Returns the close handler to use.
 */
export function useCloseOnBack(open: boolean, handleClose: () => void) {
	const handleCloseRef = useRef(handleClose);
	handleCloseRef.current = handleClose;

	useEffect(() => {
		if (!open) return;
		if (!onPlayerEntry()) {
			window.history.pushState(
				{ ...window.history.state, [HISTORY_KEY]: true },
				""
			);
		}
		const onPopState = () => {
			if (!onPlayerEntry()) handleCloseRef.current();
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [open]);

	const close = () => {
		if (onPlayerEntry()) window.history.back();
		else handleClose();
	};

	return close;
}
