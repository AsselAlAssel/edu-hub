"use client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface DeleteDialogProps {
	title: string;
	description: string;
	deleteDialogOpen: boolean;
	handleDeleteDialogClose: () => void;
	handleDelete: () => void | Promise<void>;
	isDeleting: boolean;
}

/** Legacy prop names mapped onto the design-system ConfirmDialog. */
export default function DeleteDialog({
	title,
	description,
	deleteDialogOpen,
	handleDeleteDialogClose,
	handleDelete,
	isDeleting,
}: DeleteDialogProps) {
	return (
		<ConfirmDialog
			open={deleteDialogOpen}
			title={title}
			description={description}
			onConfirm={handleDelete}
			onClose={handleDeleteDialogClose}
			loading={isDeleting}
		/>
	);
}
