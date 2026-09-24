import { getClasses } from "@/libs/class";
import { pageMetadata } from "@/libs/site";
import ClassesPage from "@/scenes/ClassesPage";

export const dynamic = "force-dynamic";

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
	return <ClassesPage classes={classes} />;
}
