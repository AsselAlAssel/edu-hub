"use client";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";

import type { ReactNode } from "react";
import AppDialog from "./AppDialog";

export type ConfirmDialogProps = {
	open: boolean;
	title: string;
	description: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void | Promise<void>;
	onClose: () => void;
	loading?: boolean;
	destructive?: boolean;
};

/** Confirmation for destructive actions; cancel is the default focus. */
export default function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "حذف",
	cancelLabel = "إلغاء",
	onConfirm,
	onClose,
	loading = false,
	destructive = true,
}: ConfirmDialogProps) {
	return (
		<AppDialog
			open={open}
			onClose={onClose}
			busy={loading}
			title={title}
			description={description}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={loading} autoFocus>
						{cancelLabel}
					</SecondaryButton>
					<LoadingButton
						variant='contained'
						color={destructive ? "error" : "primary"}
						loading={loading}
						onClick={() => void onConfirm()}
					>
						{confirmLabel}
					</LoadingButton>
				</>
			}
		/>
	);
}
