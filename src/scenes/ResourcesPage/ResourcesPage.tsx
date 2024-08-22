"use client";
import EmptyAddResources from "@/components/EmptyAddResources";
import EmptyState from "@/components/EmptyState";
import PageContainer from "@/components/PageContainer";
import { useResource } from "@/hooks/useResourceApi";
import useRole from "@/hooks/useRole";
import { Stack, Typography } from "@mui/material";
import { File, Folder, Video } from "@prisma/client";
import { useMemo } from "react";
import FilesSection from "./components/FilesSection";
import FolderSection from "./components/FolderSection";
import VideosSection from "./components/VideosSection";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

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

	const isDataEmpty = useMemo(() => {
		if (data === undefined) return true;
		return (
			data?.folders.length === 0 &&
			data?.files.length === 0 &&
			data?.videos.length === 0
		);
	}, [data]);

	return (
		<PageContainer
			sx={{
				mb: 20,
			}}
		>
			<Typography variant='h4' textAlign={"center"} mb={4}>
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
				<Stack spacing={3}>
					{isDataEmpty && isAdmin ? (
						<EmptyAddResources folderId={folderId} classId={classId} />
					) : (
						<>
							<FolderSection
								folders={data?.folders ?? []}
								classId={classId}
								folderId={folderId}
							/>
							<VideosSection
								videos={data?.videos ?? []}
								classId={classId}
								folderId={folderId}
							/>

							<FilesSection
								files={data?.files ?? []}
								classId={classId}
								folderId={folderId}
							/>
						</>
					)}
				</Stack>
			)}
		</PageContainer>
	);
}
