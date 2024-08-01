import { getResources } from "@/libs/class";
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
	console.log("params", params.folderId);
	const { folderId } = params;
	if (!folderId) {
		return notFound();
	}

	const resources = await getResources(folderId);

	return <ResourcesPage resources={resources} folderId={folderId} />;
}
