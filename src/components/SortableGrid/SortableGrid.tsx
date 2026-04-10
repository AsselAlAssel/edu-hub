"use client";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Grid } from "@mui/material";
import React from "react";
import SortableItem from "@/components/SortableItem";

interface SortableGridProps<T extends { id: string }> {
	items: T[];
	isAdmin: boolean;
	renderItem: (item: T) => React.ReactNode;
	extraItems?: React.ReactNode;
}

export default function SortableGrid<T extends { id: string }>({
	items,
	isAdmin,
	renderItem,
	extraItems,
}: SortableGridProps<T>) {
	if (!isAdmin) {
		return (
			<Grid container spacing={2}>
				{items.map((item) => (
					<Grid
						item
						key={item.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{ display: "flex", width: "100%" }}
					>
						{renderItem(item)}
					</Grid>
				))}
			</Grid>
		);
	}

	return (
		<SortableContext
			items={items.map((i) => i.id)}
			strategy={rectSortingStrategy}
		>
			<Grid container spacing={2}>
				{items.map((item) => (
					<Grid
						item
						key={item.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{ display: "flex", width: "100%" }}
					>
						<SortableItem id={item.id}>{renderItem(item)}</SortableItem>
					</Grid>
				))}
				{extraItems}
			</Grid>
		</SortableContext>
	);
}
