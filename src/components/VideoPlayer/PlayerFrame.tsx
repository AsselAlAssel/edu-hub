"use client";
import useFullscreen from "@/hooks/useFullscreen";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import { Box, Button, IconButton, Stack } from "@mui/material";
import type { ReactNode, RefObject } from "react";

/** Pinned over the viewport: iPhone fullscreen, and phones held sideways. */
const pinned = {
	position: "fixed",
	inset: 0,
	zIndex: 1,
	width: "100vw",
	height: "100dvh",
	maxWidth: "none",
	aspectRatio: "auto",
	borderRadius: 0,
} as const;

/** 16:9 player box shared by the YouTube and Bunny players, with fullscreen. */
export default function PlayerFrame({
	boxRef,
	children,
}: {
	boxRef: RefObject<HTMLDivElement | null>;
	children: ReactNode;
}) {
	const { pseudo, enter, exit } = useFullscreen(boxRef);

	return (
		<Stack spacing={1.5}>
			<Box
				ref={boxRef}
				sx={(theme) => ({
					position: "relative",
					aspectRatio: "16 / 9",
					maxWidth: "calc((100dvh - 200px) * 16 / 9)",
					width: "100%",
					mx: "auto",
					borderRadius: `${theme.tokens.radii.md}px`,
					overflow: "hidden",
					backgroundColor: theme.palette.common.black,
					"&:fullscreen": { maxWidth: "none", borderRadius: 0 },
					...(pseudo && pinned),
					"@media (orientation: landscape) and (max-height: 500px)": pinned,
				})}
			>
				{children}
				{pseudo ? (
					<IconButton
						onClick={exit}
						aria-label='الخروج من ملء الشاشة'
						sx={{
							position: "absolute",
							top: 8,
							insetInlineEnd: 8,
							zIndex: 3,
							color: "common.white",
							backgroundColor: "rgba(0,0,0,0.45)",
							"&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
						}}
					>
						<CloseFullscreenRoundedIcon />
					</IconButton>
				) : null}
			</Box>
			<Button
				size='small'
				startIcon={<FullscreenRoundedIcon />}
				onClick={() => void enter()}
				sx={{ alignSelf: "flex-start" }}
			>
				ملء الشاشة
			</Button>
		</Stack>
	);
}
