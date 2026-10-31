"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { Reveal } from "@/components/ui/motion";
import useRole from "@/hooks/useRole";
import { getErrorMessage } from "@/libs/errors";
import type { Story } from "@/libs/story";
import { deleteStoryRequest } from "@/services/story.service";
import { Box, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import StoryMedia from "./StoryMedia";

// Admin-only dialogs: loaded on demand (visitors never download them).
const StoryDialog = dynamic(() => import("./StoryDialog"), { ssr: false });
const ConfirmDialog = dynamic(() => import("@/components/ui/ConfirmDialog"), {
	ssr: false,
});

/** One story: media on one side, text on the other; sides alternate. */
export default function StoryItem({
	story,
	index,
	handle,
}: {
	story: Story;
	index: number;
	/** Drag handle (admins). */
	handle?: ReactNode;
}) {
	const { isAdmin } = useRole();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const flip = index % 2 === 1;

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteStoryRequest(story.id);
			await mutate("/api/story");
			toast.success("تم حذف القصة");
			setDeleteOpen(false);
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر حذف القصة"));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<Box
			component='article'
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" },
				gap: { xs: 2.5, md: 6 },
				alignItems: "center",
				// Media first on phones; sides alternate from md up.
				"& > .qa-story-media": { order: { xs: 0, md: flip ? 2 : 0 } },
			}}
		>
			<Reveal y={36} className='qa-story-media' style={{ minWidth: 0 }}>
				<StoryMedia story={story} />
			</Reveal>

			<Reveal delay={0.12} style={{ minWidth: 0, order: 1 }}>
				<Stack direction='row' alignItems='flex-start' gap={1}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Box
							aria-hidden
							className='qa-latin'
							sx={(theme) => ({
								fontSize: "0.85rem",
								fontWeight: 700,
								letterSpacing: "0.12em",
								color: theme.tokens.colors.cyan,
								mb: 1,
							})}
						>
							{String(index + 1).padStart(2, "0")}
						</Box>
						<Typography
							variant='h4'
							component='h2'
							sx={{ fontWeight: 700, overflowWrap: "anywhere", mb: 1.5 }}
						>
							{story.title}
						</Typography>
						{story.description ? (
							<Typography
								color='text.secondary'
								sx={{
									whiteSpace: "pre-line",
									overflowWrap: "anywhere",
									lineHeight: 1.9,
								}}
							>
								{story.description}
							</Typography>
						) : null}
					</Box>
					{isAdmin ? (
						<Stack direction='row' gap={0.5}>
							{handle}
							<ActionsMenu
								label={`خيارات القصة: ${story.title}`}
								editLabel='تعديل القصة'
								deleteLabel='حذف القصة'
								onEdit={() => setEditOpen(true)}
								onDelete={() => setDeleteOpen(true)}
							/>
						</Stack>
					) : null}
				</Stack>
			</Reveal>

			{isAdmin ? (
				<>
					<StoryDialog
						open={editOpen}
						onClose={() => setEditOpen(false)}
						story={story}
					/>
					<ConfirmDialog
						open={deleteOpen}
						title='حذف القصة'
						description={`سيتم حذف «${story.title}» نهائياً.`}
						confirmLabel='حذف'
						destructive
						loading={deleting}
						onConfirm={handleDelete}
						onClose={() => setDeleteOpen(false)}
					/>
				</>
			) : null}
		</Box>
	);
}
