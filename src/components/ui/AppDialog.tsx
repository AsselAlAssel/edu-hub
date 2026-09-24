"use client";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
	type Theme,
} from "@mui/material";
import { useId, type FormEvent, type ReactNode } from "react";

export type AppDialogProps = {
	open: boolean;
	onClose: () => void;
	title: ReactNode;
	description?: ReactNode;
	children?: ReactNode;
	actions?: ReactNode;
	/** When set, the dialog is a <form>: Enter submits, validation is native. */
	onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
	/** Blocks Escape/backdrop/close while a request is in flight. */
	busy?: boolean;
	maxWidth?: "xs" | "sm" | "md";
};

/** Accessible dialog shell: labelled title, close button, Escape handling. */
export default function AppDialog({
	open,
	onClose,
	title,
	description,
	children,
	actions,
	onSubmit,
	busy = false,
	maxWidth = "xs",
}: AppDialogProps) {
	const titleId = useId();
	const descriptionId = useId();
	const fullScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm")
	);
	const close = () => {
		if (!busy) onClose();
	};
	const formPaperProps = onSubmit && {
		component: "form" as const,
		noValidate: true,
		onSubmit: (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			onSubmit(event);
		},
	};

	return (
		<Dialog
			open={open}
			onClose={close}
			fullWidth
			maxWidth={maxWidth}
			fullScreen={fullScreen && maxWidth !== "xs"}
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
			PaperProps={formPaperProps}
		>
			{/* `pr` is flipped to the inline end by the RTL stylis plugin. */}
			<Stack direction='row' alignItems='flex-start' gap={1} sx={{ pr: 1.5 }}>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					{/* Title and description are siblings so the dialog's name is only the title. */}
					<DialogTitle id={titleId}>{title}</DialogTitle>
					{description ? (
						<Typography
							id={descriptionId}
							variant='body2'
							sx={{ color: "text.secondary", px: 3, mt: -0.5, mb: 1 }}
						>
							{description}
						</Typography>
					) : null}
				</Box>
				<IconButton
					onClick={close}
					disabled={busy}
					aria-label='إغلاق'
					sx={{ mt: 2 }}
				>
					<CloseRoundedIcon />
				</IconButton>
			</Stack>
			{children ? <DialogContent>{children}</DialogContent> : null}
			{actions ? <DialogActions>{actions}</DialogActions> : null}
		</Dialog>
	);
}
