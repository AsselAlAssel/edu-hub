import { getClasses } from "@/libs/class";
import JsonLd, { coursesJsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, SITE_URL } from "@/libs/site";
import ClassesPage from "@/scenes/ClassesPage";

// Cached and regenerated at most every minute (class writes also call
// revalidatePath). Admins see live data through SWR on the client.
export const revalidate = 60;

export const metadata = pageMetadata({
	title: "صفوف الفيزياء - جميع المراحل الدراسية",
	description:
		"استعرض صفوف الفيزياء من إعداد الأستاذ محمد صبح (Mohammed Subuh): شروحات مصوّرة وملفات منظّمة لكل مرحلة دراسية.",
	path: "/classes",
	keywords: [
		"صفوف الفيزياء",
		"شروحات الفيزياء",
		"محمد صبح",
		"دروس الفيزياء",
		"Mohammed Subuh",
	],
});

export default async function Page() {
	const classes = await getClasses();
	const courses = classes
		.filter((item) => item.folders[0])
		.map((item) => ({
			id: item.id,
			name: item.name,
			description: item.description,
			url: `${SITE_URL}/class/${item.id}/folder/${item.folders[0].id}`,
		}));
	return (
		<>
			{courses.length ? <JsonLd data={coursesJsonLd(courses)} /> : null}
			<ClassesPage classes={classes} />
		</>
	);
}
