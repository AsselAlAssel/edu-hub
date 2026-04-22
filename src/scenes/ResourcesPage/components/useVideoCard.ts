"use client";

import usePopoverState from "@/hooks/usePopoverState";
import { useCallback } from "react";

export function useVideoCard() {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();

	const handleCardClick = useCallback((onPlay: () => void) => {
		onPlay();
	}, []);

	return {
		menuOpen: open,
		anchorEl,
		handleOpen,
		handleClose,
		handleCardClick,
	};
}
