import React, { useState } from "react";
import { Video } from "@prisma/client";
import { Box, Grid, Typography } from "@mui/material";
import VideoCard from "./VideoCard";
import { useDeleteVideo, useUpdateVideoName } from "@/hooks/useResourceApi";
import DeleteDialog from "@/components/DeleteDialog";
import { mutate } from "swr";
import useRole from "@/hooks/useRole";
import AddVideoCard from "./AddVideoCard";
import VideoForm from "@/components/VideoForm";
import ChangeNameForm from "@/components/ChangeNameForm";
import VideoPlayer from "@/components/VideoPlayer";

export default function VideosSection({
	videos,
	classId,
	folderId,
}: {
	videos: Video[];
	classId: string;
	folderId: string;
}) {
	const [open, setOpen] = useState(false);
	const [openChangeName, setOpenChangeName] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
	const [openPlayer, setOpenPlayer] = useState(false);

	const { isLoading, updateVideoName } = useUpdateVideoName();
	const { deleteVideo, isLoading: isDeleting } = useDeleteVideo();
	const { isAdmin } = useRole();
	const isDataEmpty = videos.length === 0;
	if (isDataEmpty && !isAdmin) return;

	return (
		<Box>
			<Typography variant='h5' mb={2}>
				الفيديوهات
			</Typography>
			<Grid container spacing={2}>
				{videos.map((video) => (
					<Grid
						item
						key={video.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<VideoCard
							video={video}
							onChangeName={() => {
								setSelectedVideo(video);
								setOpenChangeName(true);
							}}
							onDelete={() => {
								setSelectedVideo(video);
								setOpenDelete(true);
							}}
							onPlay={() => {
								setSelectedVideo(video);
								setOpenPlayer(true);
							}}
						/>
					</Grid>
				))}
				{isAdmin && (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<AddVideoCard onClick={() => setOpen(true)} />
					</Grid>
				)}
			</Grid>

			<DeleteDialog
				deleteDialogOpen={openDelete}
				handleDeleteDialogClose={() => {
					setOpenDelete(false);
					setSelectedVideo(null);
				}}
				handleDelete={async () => {
					if (!selectedVideo) return;
					mutate(
						`/api/resources/${folderId}`,
						deleteVideo({ videoId: selectedVideo?.id || "" }),
						{
							optimisticData: (oldData) => {
								return {
									...oldData,
									videos: oldData.videos.filter(
										(video: Video) => video.id !== selectedVideo?.id
									),
								};
							},
							populateCache: false,
							revalidate: false,
						}
					);
					setOpenDelete(false);
				}}
				title='حذف الفيديو'
				description='هل تريد بالتأكيد حذف هذا الفيديو؟'
				isDeleting={isDeleting}
			/>
			<VideoForm
				open={open}
				handleClose={() => setOpen(false)}
				title={"إضافة فيديو جديد"}
				folderId={folderId}
				classId={classId}
			/>
			<ChangeNameForm
				open={openChangeName && !!selectedVideo}
				handleClose={() => {
					setOpenChangeName(false);
				}}
				isUpdatingName={isLoading}
				onSubmit={async (name) => {
					if (!selectedVideo) return;
					await updateVideoName({
						videoId: selectedVideo?.id || "",
						name,
					});
					mutate(`/api/resources/${selectedVideo?.folderId || folderId}`);
					setOpenChangeName(false);
					setSelectedVideo(null);
				}}
				title='تعديل اسم الملف'
				name={selectedVideo?.name || ""}
			/>
			<VideoPlayer
				open={openPlayer && !!selectedVideo}
				handleClose={() => {
					console.log("close");
					setOpenPlayer(false);
				}}
				url={selectedVideo?.url || ""}
			/>
		</Box>
	);
}
