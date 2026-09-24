"use client";
import AppDialog from "@/components/ui/AppDialog";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

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
	return (
		<AppDialog open={open} onClose={handleClose} title={title} maxWidth='md'>
			<Box
				sx={(theme) => ({
					position: "relative",
					aspectRatio: "16 / 9",
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
