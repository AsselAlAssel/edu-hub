"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, IconButton } from "@mui/material";
import React from "react";

interface SortableItemProps {
	id: string;
	children: React.ReactNode;
	disabled?: boolean;
}

export default function SortableItem({
	id,
	children,
	disabled,
}: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, disabled });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		width: "100%",
		zIndex: isDragging ? 99999 : undefined,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			sx={{
				width: "100%",
				height: "100%",
				position: "relative",
				"&:hover .drag-handle": {
					opacity: 1,
				},
			}}
		>
			{children}
			{!disabled && (
				<IconButton
					className='drag-handle'
					{...attributes}
					{...listeners}
					size='small'
					sx={{
						position: "absolute",
						top: 10,
						left: 4,
						zIndex: 10,
						cursor: "grab",
						opacity: 0,
						transition: "opacity 0.2s",
						color: "text.secondary",
						backgroundColor: "rgba(255,255,255,0.85)",
						p: 0.3,
						"&:hover": {
							backgroundColor: "rgba(255,255,255,1)",
						},
						"&:active": { cursor: "grabbing" },
					}}
				>
					<DragIndicatorIcon sx={{ fontSize: 20 }} />
				</IconButton>
			)}
		</Box>
	);
}
