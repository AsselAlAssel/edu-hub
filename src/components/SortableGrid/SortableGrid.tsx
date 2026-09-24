"use client";
import SortableItem from "@/components/SortableItem";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Box, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

interface SortableGridProps<T extends { id: string }> {
	items: T[];
	/** Admins get sortable cells with drag handles; everyone else a plain grid. */
	isAdmin: boolean;
	renderItem: (item: T, handle?: ReactNode) => ReactNode;
	getHandleLabel?: (item: T) => string;
	/** Trailing cells (e.g. the "add" card). */
	extraItems?: ReactNode;
	gridSx: SxProps<Theme>;
	label: string;
}

export default function SortableGrid<T extends { id: string }>({
	items,
	isAdmin,
	renderItem,
	getHandleLabel = () => "إعادة ترتيب",
	extraItems,
	gridSx,
	label,
}: SortableGridProps<T>) {
	const grid = (
		<Box
			component='ul'
			aria-label={label}
			sx={[
				{ listStyle: "none", m: 0, p: 0 },
				...(Array.isArray(gridSx) ? gridSx : [gridSx]),
			]}
		>
			{items.map((item, index) => (
				<Box
					component='li'
					key={item.id}
					className='qa-rise'
					style={{ ["--i" as string]: index }}
					sx={{ minWidth: 0 }}
				>
					{isAdmin ? (
						<SortableItem id={item.id} handleLabel={getHandleLabel(item)}>
							{(handle) => renderItem(item, handle)}
						</SortableItem>
					) : (
						renderItem(item)
					)}
				</Box>
			))}
			{extraItems}
		</Box>
	);

	if (!isAdmin) return grid;

	return (
		<SortableContext
			items={items.map((item) => item.id)}
			strategy={rectSortingStrategy}
		>
			{grid}
		</SortableContext>
	);
}
