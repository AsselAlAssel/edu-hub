"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material";
import { useBackToTopFab } from "./useBackToTopFab";

export default function BackToTopFab() {
	const { visible, scrollTop } = useBackToTopFab();

	if (!visible) return null;

	return (
		<Fab
			color='primary'
			aria-label='العودة لأعلى الصفحة'
			onClick={scrollTop}
			size='medium'
			sx={(theme) => ({
				position: "fixed",
				bottom: theme.spacing(3),
				insetInlineEnd: theme.spacing(3),
				zIndex: theme.zIndex.speedDial,
			})}
		>
			<KeyboardArrowUpIcon />
		</Fab>
	);
}
