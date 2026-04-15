"use client";
import EmptyAddResources from "@/components/EmptyAddResources";
import EmptyState from "@/components/EmptyState";
import PageContainer from "@/components/PageContainer";
import { useResource } from "@/hooks/useResourceApi";
import useRole from "@/hooks/useRole";
import { Stack, Typography } from "@mui/material";
import { File, Folder, Video } from "@prisma/client";
import { useCallback, useMemo, useRef, useState } from "react";
import FilesSection from "./components/FilesSection";
import FolderSection from "./components/FolderSection";
import VideosSection from "./components/VideosSection";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import {
	DndContext,
	pointerWithin,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	CollisionDetection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { reorderItem } from "@/hooks/useReorder";
import { mutate } from "swr";
import axios from "axios";

export default function ResourcesPage({
	resources,
	folderId,
	className,
	classId,
	breadcrumb,
}: {
	resources: {
		folders: Folder[];
		files: File[];
		videos: Video[];
	};
	folderId: string;
	isRootFolder: boolean;
	className: string;
	classId: string;
	breadcrumb: {
		id: string;
		name: string;
	}[];
}) {
	const { isAdmin } = useRole();
	const { data } = useResource({
		folderId,
		resources,
	});

	const [draggedType, setDraggedType] = useState<string | null>(null);
	const [overFolderId, setOverFolderId] = useState<string | null>(null);
	const draggedTypeRef = useRef<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const folders = useMemo(() => data?.folders ?? [], [data?.folders]);
	const files = useMemo(() => data?.files ?? [], [data?.files]);
	const videos = useMemo(() => data?.videos ?? [], [data?.videos]);

	const isDataEmpty = useMemo(() => {
		if (data === undefined) return true;
		return folders.length === 0 && files.length === 0 && videos.length === 0;
	}, [data, folders, files, videos]);

	const customCollisionDetection = useCallback<CollisionDetection>(
		(args) => {
			const currentDragType = draggedTypeRef.current;
			const pointerCollisions = pointerWithin(args);
			const centerCollisions = closestCenter(args);

			if (currentDragType === "file" || currentDragType === "video") {
				const folderHits = pointerCollisions.filter((c) =>
					folders.some((f) => f.id === c.id)
				);
				if (folderHits.length > 0) return folderHits;

				const sameItems = currentDragType === "file" ? files : videos;
				return centerCollisions.filter((c) =>
					sameItems.some((i) => i.id === c.id)
				);
			}

			if (currentDragType === "folder") {
				return centerCollisions.filter((c) =>
					folders.some((f) => f.id === c.id)
				);
			}

			if (pointerCollisions.length > 0) return pointerCollisions;
			return centerCollisions;
		},
		[folders, files, videos]
	);

	const getItemType = useCallback(
		(id: string): "folder" | "file" | "video" | null => {
			if (folders.some((f) => f.id === id)) return "folder";
			if (files.some((f) => f.id === id)) return "file";
			if (videos.some((v) => v.id === id)) return "video";
			return null;
		},
		[folders, files, videos]
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const type = getItemType(event.active.id as string);
			draggedTypeRef.current = type;
			setDraggedType(type);
		},
		[getItemType]
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over) {
				setOverFolderId(null);
				return;
			}
			const activeType = getItemType(active.id as string);
			const overType = getItemType(over.id as string);

			if (
				(activeType === "file" || activeType === "video") &&
				overType === "folder"
			) {
				setOverFolderId(over.id as string);
			} else {
				setOverFolderId(null);
			}
		},
		[getItemType]
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			draggedTypeRef.current = null;
			setDraggedType(null);
			setOverFolderId(null);

			const { active, over } = event;
			if (!over || active.id === over.id) return;

			const activeId = active.id as string;
			const overId = over.id as string;
			const activeType = getItemType(activeId);
			const overType = getItemType(overId);

			if (!activeType || !overType) return;

			if (
				(activeType === "file" || activeType === "video") &&
				overType === "folder"
			) {
				const key = activeType === "file" ? "files" : "videos";
				mutate(
					`/api/resources/${folderId}`,
					(current: any) => {
						if (!current) return current;
						return {
							...current,
							[key]: current[key].filter((i: any) => i.id !== activeId),
						};
					},
					{ revalidate: false }
				);

				await axios.post("/api/move", {
					type: activeType,
					id: activeId,
					targetFolderId: overId,
				});
				mutate(`/api/resources/${folderId}`);
				mutate(`/api/resources/${overId}`);
				return;
			}

			if (activeType === overType) {
				type Rankable = { id: string; rank?: string | null };
				const items: Rankable[] =
					activeType === "folder"
						? folders
						: activeType === "file"
							? files
							: videos;

				const oldIndex = items.findIndex((i) => i.id === activeId);
				const newIndex = items.findIndex((i) => i.id === overId);
				if (oldIndex === -1 || newIndex === -1) return;

				const sorted = [...items];
				const [moved] = sorted.splice(oldIndex, 1);
				sorted.splice(newIndex, 0, moved);

				const beforeItem = newIndex > 0 ? sorted[newIndex - 1] : null;
				const afterItem =
					newIndex < sorted.length - 1 ? sorted[newIndex + 1] : null;

				const dataKey =
					activeType === "folder"
						? "folders"
						: activeType === "file"
							? "files"
							: "videos";
				mutate(
					`/api/resources/${folderId}`,
					(current: any) => {
						if (!current) return current;
						return { ...current, [dataKey]: sorted };
					},
					{ revalidate: false }
				);

				await reorderItem({
					type: activeType,
					id: moved.id,
					beforeRank: beforeItem?.rank,
					afterRank: afterItem?.rank,
				});
				mutate(`/api/resources/${folderId}`);
			}
		},
		[getItemType, folders, files, videos, folderId]
	);

	const isDraggingFileOrVideo =
		draggedType === "file" || draggedType === "video";

	const sections = (
		<>
			<FolderSection
				folders={folders}
				classId={classId}
				folderId={folderId}
				isDraggingItem={isDraggingFileOrVideo}
				overFolderId={overFolderId}
			/>
			<VideosSection videos={videos} classId={classId} folderId={folderId} />
			<FilesSection files={files} classId={classId} folderId={folderId} />
		</>
	);

	return (
		<PageContainer sx={{ mb: 10 }}>
			<Stack spacing={4}>
				<Typography
					variant='h4'
					textAlign={"center"}
					sx={{ fontWeight: 700, pt: 1 }}
				>
					مرحباً بك في {className}
				</Typography>
				<Breadcrumb
					breadcrumb={breadcrumb}
					classId={classId}
					folderId={folderId}
				/>

				{isDataEmpty && !isAdmin ? (
					<EmptyState
						title='لا توجد موارد لعرضها حتى الآن'
						description='سيتم إضافة الموارد قريباً'
					/>
				) : (
					<Stack spacing={5}>
						{isDataEmpty && isAdmin ? (
							<EmptyAddResources folderId={folderId} classId={classId} />
						) : isAdmin ? (
							<DndContext
								sensors={sensors}
								collisionDetection={customCollisionDetection}
								onDragStart={handleDragStart}
								onDragOver={handleDragOver}
								onDragEnd={handleDragEnd}
							>
								<Stack spacing={5}>{sections}</Stack>
							</DndContext>
						) : (
							sections
						)}
					</Stack>
				)}
			</Stack>
		</PageContainer>
	);
}
