"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const SHOW_AFTER_PX = 320;

export default function BackToTopFab() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(window.scrollY > SHOW_AFTER_PX);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

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
				zIndex: 998,
				boxShadow: theme.shadows[8],
			})}
		>
			<KeyboardArrowUpIcon />
		</Fab>
	);
}
