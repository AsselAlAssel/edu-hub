"use client";
import EmptyAddResources from "@/components/EmptyAddResources";
import EmptyState from "@/components/EmptyState";
import PageContainer from "@/components/PageContainer";
import { useResource } from "@/hooks/useResourceApi";
import useRole from "@/hooks/useRole";
import { Typography } from "@mui/material";
import { Folder, Resource } from "@prisma/client";
import { useMemo } from "react";
import FolderSection from "./components/FolderSection";
import FilesSection from "./components/FilesSection";

export default function ResourcesPage({
	resources,
	folderId,
	className,
	classId,
}: {
	resources: {
		folders: Folder[];
		resources: Resource[];
	};
	folderId: string;
	isRootFolder: boolean;
	className: string;
	classId: string;
}) {
	const { isAdmin } = useRole();
	const { data } = useResource({
		folderId,
		resources,
	});
	console.log(data);

	const isDataEmpty = useMemo(() => {
		if (data === undefined) return true;
		return data?.folders.length === 0 && data?.resources.length === 0;
	}, [data]);

	return (
		<PageContainer>
			<Typography variant='h4' textAlign={"center"} mb={4}>
				مرحباً بك في {className}
			</Typography>

			{isDataEmpty && !isAdmin ? (
				<EmptyState
					title='لا توجد موارد لعرضها حتى الآن'
					description='سيتم إضافة الموارد قريباً'
				/>
			) : null}
			{isDataEmpty && isAdmin ? (
				<EmptyAddResources folderId={folderId} classId={classId} />
			) : null}
			{data?.folders.length ? <FolderSection folders={data.folders} /> : null}

			{data?.resources.length ? (
				<FilesSection resources={data.resources} />
			) : null}
		</PageContainer>
	);
}
