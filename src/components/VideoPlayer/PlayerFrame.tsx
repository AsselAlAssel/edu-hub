"use client";
import { Box } from "@mui/material";
import type { ReactNode, RefObject } from "react";

/** Phones held sideways: the player fills the screen instead of a tiny box. */
const landscapePhone = {
	position: "fixed",
	inset: 0,
	zIndex: 1,
	width: "100vw",
	height: "100dvh",
	maxWidth: "none",
	aspectRatio: "auto",
	borderRadius: 0,
} as const;

/** 16:9 player box shared by the YouTube and Bunny players. */
export default function PlayerFrame({
	boxRef,
	children,
}: {
	boxRef?: RefObject<HTMLDivElement | null>;
	children: ReactNode;
}) {
	return (
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
				"@media (orientation: landscape) and (max-height: 500px)":
					landscapePhone,
			})}
		>
			{children}
		</Box>
	);
}
