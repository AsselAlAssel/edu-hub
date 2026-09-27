"use client";
import AppDialog from "@/components/ui/AppDialog";
import { Box, CircularProgress } from "@mui/material";
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
}: {
	open: boolean;
	handleClose: () => void;
	url: string;
	title?: string;
}) {
	const handleCloseRef = useRef(handleClose);
	handleCloseRef.current = handleClose;

	// The device/browser back button closes the player instead of leaving the
	// page: opening pushes a history entry (keeping Next's router state),
	// and every close goes back through it.
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

	return (
		<AppDialog
			open={open}
			onClose={close}
			title={title}
			maxWidth='md'
			fullScreenOnMobile={false}
		>
			<Box
				sx={(theme) => ({
					position: "relative",
					aspectRatio: "16 / 9",
					// Fit the viewport height too (phones in landscape).
					maxWidth: "calc((100dvh - 150px) * 16 / 9)",
					mx: "auto",
					borderRadius: `${theme.tokens.radii.md}px`,
					overflow: "hidden",
					backgroundColor: theme.palette.common.black,
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
						config={{ playerVars: { rel: 0 } }}
					/>
				) : null}
			</Box>
		</AppDialog>
	);
}
