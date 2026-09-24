import { isObjectId } from "@/libs/api";
import { getClass, getResources } from "@/libs/class";
import { getBreadcrumbs } from "@/libs/folder";
import JsonLd, { breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, SITE_URL } from "@/libs/site";
import ResourcesPage from "@/scenes/ResourcesPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// Cached and regenerated at most every minute (class writes also call
// revalidatePath). Admins see live data through SWR on the client.
export const revalidate = 60;

type Params = { classId: string; folderId: string };

// No paths at build time: each folder page is generated on its first visit,
// then served from cache (ISR) until `revalidate` or a content write.
export function generateStaticParams(): Params[] {
	return [];
}

/**
 * Loads the class and the folder chain, and verifies the folder belongs to
 * the class (its chain must start at the class root folder). Cached per request
 * so metadata and the page share one lookup.
 */
// Primitive arguments: React `cache` compares by identity, so an object here
// would never be shared between generateMetadata and the page.
const loadFolder = cache(async (classId: string, folderId: string) => {
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

type Props = { params: Promise<Params> };

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const loaded = await loadFolder(params.classId, params.folderId);
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

export default async function Page(props: Props) {
	const params = await props.params;
	const loaded = await loadFolder(params.classId, params.folderId);
	if (!loaded) notFound();

	const { classItem, breadcrumb, rootFolderId } = loaded;
	const resources = await getResources(params.folderId);

	const folderUrl = (id: string) =>
		`${SITE_URL}/class/${params.classId}/folder/${id}`;
	const trail = [
		{ name: "الرئيسية", url: SITE_URL },
		{ name: "الصفوف", url: `${SITE_URL}/classes` },
		...breadcrumb.map((crumb, index) => ({
			name: index === 0 ? classItem.name : crumb.name,
			url: folderUrl(crumb.id),
		})),
	];

	return (
		<>
			<JsonLd data={breadcrumbJsonLd(trail)} />
			<ResourcesPage
				resources={resources}
				folderId={params.folderId}
				isRootFolder={rootFolderId === params.folderId}
				className={classItem.name}
				classId={params.classId}
				breadcrumb={breadcrumb}
			/>
		</>
	);
}
