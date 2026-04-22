"use client";

import { ICONS_FORMAT_FILE } from "@/libs/constant";
import usePopoverState from "@/hooks/usePopoverState";
import type { File } from "@prisma/client";
import { useMemo } from "react";

export function useFileCard(file: File) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();

	const isFormatKnown = useMemo(() => {
		return ICONS_FORMAT_FILE.includes(file.type);
	}, [file.name]);

	const isClosed = useMemo(() => {
		return file.url === "#";
	}, [file.url]);

	return {
		menuOpen: open,
		anchorEl,
		handleOpen,
		handleClose,
		isFormatKnown,
		isClosed,
		isLink: file.url !== "#",
	};
}
