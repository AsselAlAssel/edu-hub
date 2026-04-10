"use client";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Grid } from "@mui/material";
import React, { useCallback } from "react";
import SortableItem from "@/components/SortableItem";
import { ReorderType, reorderItem } from "@/hooks/useReorder";
import { mutate } from "swr";

interface SortableGridProps<T extends { id: string; rank?: string | null }> {
	items: T[];
	type: ReorderType;
	folderId: string;
	isAdmin: boolean;
	renderItem: (item: T) => React.ReactNode;
	extraItems?: React.ReactNode;
}

export default function SortableGrid<
	T extends { id: string; rank?: string | null },
>({
	items,
	type,
	folderId,
	isAdmin,
	renderItem,
	extraItems,
}: SortableGridProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;

			const oldIndex = items.findIndex((i) => i.id === active.id);
			const newIndex = items.findIndex((i) => i.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return;

			const sorted = [...items];
			const [moved] = sorted.splice(oldIndex, 1);
			sorted.splice(newIndex, 0, moved);

			const beforeItem = newIndex > 0 ? sorted[newIndex - 1] : null;
			const afterItem =
				newIndex < sorted.length - 1 ? sorted[newIndex + 1] : null;

			mutate(
				`/api/resources/${folderId}`,
				(current: any) => {
					if (!current) return current;
					const key =
						type === "folder"
							? "folders"
							: type === "file"
								? "files"
								: "videos";
					return { ...current, [key]: sorted };
				},
				{ revalidate: false }
			);

			await reorderItem({
				type,
				id: moved.id,
				beforeRank: beforeItem?.rank,
				afterRank: afterItem?.rank,
			});

			mutate(`/api/resources/${folderId}`);
		},
		[items, type, folderId]
	);

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
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
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
		</DndContext>
	);
}
