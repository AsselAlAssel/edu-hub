"use client";
import SortableGrid from "@/components/SortableGrid";
import { cardGridSx } from "@/components/ui/Skeletons";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import { Box } from "@mui/material";
import type { Video } from "@prisma/client";
import AddResourceCard from "./AddResourceCard";
import ResourceSection from "./ResourceSection";
import VideoCard from "./VideoCard";

export default function VideosSection({
	videos,
	isAdmin,
	onAdd,
	onPlay,
	onRename,
	onDelete,
	onMove,
}: {
	videos: Video[];
	isAdmin: boolean;
	onAdd: () => void;
	onPlay: (video: Video) => void;
	onRename: (video: Video) => void;
	onDelete: (video: Video) => void;
	onMove?: (video: Video) => void;
}) {
	if (!videos.length && !isAdmin) return null;

	return (
		<ResourceSection
			id='videos-title'
			title='الفيديوهات'
			count={videos.length}
			icon={<SmartDisplayOutlinedIcon />}
		>
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
