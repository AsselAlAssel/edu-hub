import { isObjectId } from "@/libs/api";
import { getClass, getResources } from "@/libs/class";
import { getBreadcrumbs } from "@/libs/folder";
import { pageMetadata } from "@/libs/site";
import ResourcesPage from "@/scenes/ResourcesPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export const dynamic = "force-dynamic";

type Params = { classId: string; folderId: string };

/**
 * Loads the class and the folder chain, and verifies the folder belongs to
 * the class (its chain must start at the class root folder). Cached per request
 * so metadata and the page share one lookup.
 */
const loadFolder = cache(async ({ classId, folderId }: Params) => {
	if (!isObjectId(classId) || !isObjectId(folderId)) return null;
	const [classItem, breadcrumb] = await Promise.all([
		getClass(classId),
		getBreadcrumbs(folderId),
	]);
	const rootFolderId = classItem?.folders[0]?.id;
	if (!classItem || !rootFolderId || !breadcrumb?.length) return null;
	if (breadcrumb[0].id !== rootFolderId) return null;
	return { classItem, breadcrumb, rootFolderId };
});

export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<Metadata> {
	const loaded = await loadFolder(params);
	if (!loaded) return { title: "غير موجود", robots: { index: false } };

	const { classItem, breadcrumb, rootFolderId } = loaded;
	const folderName =
		params.folderId === rootFolderId
			? null
			: breadcrumb[breadcrumb.length - 1].name;
	const title = folderName
		? `${folderName} — ${classItem.name}`
		: `${classItem.name} — شروحات الفيزياء`;

	return pageMetadata({
		title,
		description: `شروحات فيديو وملفات ${folderName ? `«${folderName}» في ` : ""}${classItem.name} من إعداد الأستاذ محمد صبح.`,
		path: `/class/${params.classId}/folder/${params.folderId}`,
		keywords: [classItem.name, "شروحات الفيزياء", "محمد صبح", "Mohammed Subuh"],
	});
}

export default async function Page({ params }: { params: Params }) {
	const loaded = await loadFolder(params);
	if (!loaded) notFound();

	const { classItem, breadcrumb, rootFolderId } = loaded;
	const resources = await getResources(params.folderId);

	return (
		<ResourcesPage
			resources={resources}
			folderId={params.folderId}
			isRootFolder={rootFolderId === params.folderId}
			className={classItem.name}
			classId={params.classId}
			breadcrumb={breadcrumb}
		/>
	);
}
