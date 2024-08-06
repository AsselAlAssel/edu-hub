import { getClass, getResources } from "@/libs/class";
import ResourcesPage from "@/scenes/ResourcesPage";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({
	params,
}: {
	params: {
		classId: string;
		folderId: string;
	};
}) {
	const { folderId } = params;
	if (!folderId) {
		return notFound();
	}

	const classItem = await getClass(params.classId);
	const rootFolderId = await classItem?.folders[0].id;

	if (!rootFolderId || !classItem) {
		return notFound();
	}

	const resources = await getResources(folderId);
	const isRootFolder = rootFolderId === folderId;

	return (
		<ResourcesPage
			resources={resources}
			folderId={folderId}
			isRootFolder={isRootFolder}
			className={classItem?.name}
			classId={params.classId}
		/>
	);
}
