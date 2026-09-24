"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { Box, IconButton } from "@mui/material";
import type { ReactNode } from "react";

interface SortableItemProps {
	id: string;
	/** Accessible name of the handle, e.g. "إعادة ترتيب: الوحدة الأولى". */
	handleLabel: string;
	children: (handle: ReactNode) => ReactNode;
}

/**
 * Sortable cell. The card decides where to place the drag handle; only the
 * handle starts a drag, so card links and menus keep working.
 */
export default function SortableItem({
	id,
	handleLabel,
	children,
}: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const handle = (
		<IconButton
			ref={setActivatorNodeRef}
			size='small'
			{...attributes}
			{...listeners}
			aria-label={handleLabel}
			aria-roledescription='عنصر قابل للسحب'
			sx={(theme) => ({
				position: "relative",
				zIndex: 2,
				cursor: isDragging ? "grabbing" : "grab",
				touchAction: "none",
				color: "text.secondary",
				backgroundColor: theme.tokens.colors.surface,
				border: `1px solid ${theme.tokens.colors.border}`,
				"&:hover": {
					color: "primary.main",
					backgroundColor: theme.tokens.colors.surfaceSecondary,
				},
			})}
		>
			<DragIndicatorRoundedIcon fontSize='small' />
		</IconButton>
	);

	return (
		<Box
			ref={setNodeRef}
			style={{ transform: CSS.Translate.toString(transform), transition }}
			sx={(theme) => ({
				height: "100%",
				position: "relative",
				zIndex: isDragging ? 10 : undefined,
				opacity: isDragging ? 0.85 : 1,
				borderRadius: `${theme.tokens.radii.lg}px`,
				boxShadow: isDragging ? theme.tokens.shadows.strong : "none",
			})}
		>
			{children(handle)}
		</Box>
	);
}
