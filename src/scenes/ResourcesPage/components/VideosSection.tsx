"use client";
import SortableGrid from "@/components/SortableGrid";
import { cardGridSx } from "@/components/ui/Skeletons";
import type useProgress from "@/hooks/useProgress";
import GoogleIcon from "@mui/icons-material/Google";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import type { ResourceVideo } from "@/libs/class";
import type { Video } from "@prisma/client";
import { signInWithGoogle } from "@/components/Auth/GoogleSigninDialog";
import toast from "react-hot-toast";
import AddResourceCard from "./AddResourceCard";
import ResourceSection from "./ResourceSection";
import VideoCard from "./VideoCard";

type Progress = ReturnType<typeof useProgress>;

/** "3 من 8 مكتملة" bar for students; a Google sign-in nudge for guests. */
function ProgressSummary({
	videos,
	progress,
}: {
	videos: ResourceVideo[];
	progress: Progress;
}) {
	if (!progress.signedIn) {
		return (
			<Stack
				direction={{ xs: "column", sm: "row" }}
				alignItems={{ sm: "center" }}
				justifyContent='space-between'
				gap={1.5}
				sx={(theme) => ({
					mb: 2.5,
					p: 2,
					borderRadius: `${theme.tokens.radii.md}px`,
					border: `1px dashed ${theme.tokens.colors.border}`,
				})}
			>
				<Typography variant='body2' sx={{ color: "text.secondary" }}>
					سجّل دخولك بحساب Google لتحفظ تقدّمك وتكمل الفيديو من حيث توقفت.
				</Typography>
				<Button
					variant='outlined'
					size='small'
					startIcon={<GoogleIcon />}
					onClick={signInWithGoogle}
					sx={{ flexShrink: 0 }}
				>
					تسجيل الدخول
				</Button>
			</Stack>
		);
	}

	const done = videos.filter(
		(video) => progress.byVideo.get(video.id)?.completed
	).length;
	return (
		<Box sx={{ mb: 2.5 }}>
			<Typography variant='body2' sx={{ color: "text.secondary", mb: 1 }}>
				أنهيت {done} من {videos.length}
			</Typography>
			<LinearProgress
				variant='determinate'
				value={(done / videos.length) * 100}
				aria-label={`أنهيت ${done} من ${videos.length} فيديو`}
				sx={{ height: 8, borderRadius: 4 }}
			/>
		</Box>
	);
}

export default function VideosSection({
	videos,
	isAdmin,
	progress,
	onAdd,
	onPlay,
	onRename,
	onDelete,
	onMove,
	isLocked = () => false,
}: {
	videos: ResourceVideo[];
	isAdmin: boolean;
	progress: Progress;
	/** Paid-unit videos the student cannot open (shown with a lock). */
	/** null: not known yet. */
	isLocked?: (video: Video) => boolean | null;
	onAdd: () => void;
	onPlay: (video: Video) => void;
	onRename: (video: Video) => void;
	onDelete: (video: Video) => void;
	onMove?: (video: Video) => void;
}) {
	if (!videos.length && !isAdmin) return null;

	const toggleDone = async (video: Video, completed: boolean) => {
		try {
			await progress.save(video.id, { completed });
		} catch {
			toast.error("تعذّر حفظ التقدّم، حاول مرة أخرى");
		}
	};

	return (
		<ResourceSection
			id='videos-title'
			title='الفيديوهات'
			count={videos.length}
			icon={<SmartDisplayOutlinedIcon />}
		>
			{videos.length && !isAdmin ? (
				<ProgressSummary videos={videos} progress={progress} />
			) : null}
			<SortableGrid
				items={videos}
				isAdmin={isAdmin}
				gridSx={cardGridSx}
				label='الفيديوهات'
				getHandleLabel={(video) => `إعادة ترتيب الفيديو: ${video.name}`}
				renderItem={(video, handle) => (
					<VideoCard
						video={video}
						handle={handle}
						isAdmin={isAdmin}
						progress={progress.byVideo.get(video.id)}
						locked={isLocked(video)}
						onToggleDone={
							progress.signedIn && !isAdmin && isLocked(video) === false
								? (completed) => void toggleDone(video, completed)
								: undefined
						}
						onPlay={() => onPlay(video)}
						onChangeName={() => onRename(video)}
						onDelete={() => onDelete(video)}
						onMove={onMove ? () => onMove(video) : undefined}
					/>
				)}
				extraItems={
					isAdmin ? (
						<Box component='li'>
							<AddResourceCard label='إضافة فيديو' onClick={onAdd} />
						</Box>
					) : null
				}
			/>
		</ResourceSection>
	);
}
