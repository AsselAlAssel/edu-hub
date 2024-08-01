"use client";
import PageContainer from "@/components/PageContainer";
import { useResource } from "@/hooks/useResourceApi";
import { Folder, Resource } from "@prisma/client";

export default function ResourcesPage({
	resources,
	folderId,
}: {
	resources: {
		folders: Folder[];
		resources: Resource[];
	};
	folderId: string;
}) {
	const { data, isLoading } = useResource({
		folderId,
		resources,
	});
	console.log(data);
	if (isLoading) {
		return <PageContainer>Loading...</PageContainer>;
	}
	return (
		<PageContainer>
			<h1>Class Page</h1>
		</PageContainer>
	);
}
