"use client";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { PrimaryButton } from "@/components/ui/buttons";
import SortableItem from "@/components/SortableItem";
import useRole from "@/hooks/useRole";
import { getErrorMessage } from "@/libs/errors";
import type { Story } from "@/libs/story";
import { reorderItem } from "@/services/reorder.service";
import { fetchStories } from "@/services/story.service";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { Button, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import useSwr from "swr";
import StoryItem from "./StoryItem";

// Admin-only UI: loaded on demand so visitors never download the form code.
const StoryDialog = dynamic(() => import("./StoryDialog"), { ssr: false });

export default function ResultsPage({ stories }: { stories: Story[] }) {
	const { data, error, mutate } = useSwr<Story[]>("/api/story", fetchStories, {
		fallbackData: stories,
		revalidateOnMount: false,
		revalidateOnFocus: false,
	});
	const list = data ?? [];
	const { isAdmin } = useRole();
	const [createOpen, setCreateOpen] = useState(false);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	const handleDragEnd = async ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) return;
		const from = list.findIndex((s) => s.id === active.id);
		const to = list.findIndex((s) => s.id === over.id);
		const moved = arrayMove(list, from, to);
		void mutate(moved, { revalidate: false });
		try {
			await reorderItem({
				type: "story",
				id: String(active.id),
				beforeRank: moved[to - 1]?.rank ?? null,
				afterRank: moved[to + 1]?.rank ?? null,
			});
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حفظ الترتيب"));
		}
		await mutate();
	};

	const createButton = isAdmin ? (
		<PrimaryButton
			startIcon={<AddRoundedIcon />}
			onClick={() => setCreateOpen(true)}
		>
			إضافة قصة
		</PrimaryButton>
	) : null;

	const items = (
		<Stack
			component='ol'
			spacing={{ xs: 6, md: 10 }}
			sx={{ listStyle: "none", m: 0, p: 0 }}
		>
			{list.map((story, index) =>
				isAdmin ? (
					<li key={story.id}>
						<SortableItem
							id={story.id}
							handleLabel={`إعادة ترتيب: ${story.title}`}
						>
							{(handle) => (
								<StoryItem story={story} index={index} handle={handle} />
							)}
						</SortableItem>
					</li>
				) : (
					<li key={story.id}>
						<StoryItem story={story} index={index} />
					</li>
				)
			)}
		</Stack>
	);

	return (
		<PageShell>
			<PageHeader
				eyebrow='قصص نجاح'
				title={
					<>
						نتائج <span className='qa-gradient-text'>طلابنا</span>
					</>
				}
				description='طلاب درسوا معنا ووصلوا لأهدافهم، هذه قصصهم.'
				actions={createButton}
			/>

			{error && !list.length ? (
				<ErrorState
					action={
						<Button variant='outlined' onClick={() => void mutate()}>
							إعادة المحاولة
						</Button>
					}
				/>
			) : !list.length ? (
				<EmptyState
					icon={<EmojiEventsOutlinedIcon />}
					title='لا توجد قصص بعد'
					description={
						isAdmin
							? "أضف أول قصة نجاح: عنوان ووصف مع صور أو فيديو."
							: "سيتم إضافة قصص طلابنا قريباً."
					}
					action={createButton}
				/>
			) : isAdmin ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={(event) => void handleDragEnd(event)}
				>
					<SortableContext
						items={list.map((s) => s.id)}
						strategy={verticalListSortingStrategy}
					>
						{items}
					</SortableContext>
				</DndContext>
			) : (
				items
			)}

			{isAdmin ? (
				<StoryDialog open={createOpen} onClose={() => setCreateOpen(false)} />
			) : null}
		</PageShell>
	);
}
