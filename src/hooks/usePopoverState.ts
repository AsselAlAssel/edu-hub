import { useState } from "react";

type PopoverState = [
	open: boolean,
	anchorEl: null | HTMLElement,
	handleOpen: (e: React.MouseEvent<HTMLElement>) => void,
	handleClose: () => void,
];

export default function usePopoverState(): PopoverState {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleOpen: PopoverState[2] = (
		event: React.MouseEvent<HTMLElement>
	) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return [open, anchorEl, handleOpen, handleClose];
}
