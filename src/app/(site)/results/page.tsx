import { pageMetadata } from "@/libs/site";
import { getStories } from "@/libs/story";
import ResultsPage from "@/scenes/ResultsPage";

// Cached and regenerated at most every minute (story writes also call
// revalidatePath). Admins see their edits at once through SWR.
export const revalidate = 60;

export const metadata = pageMetadata({
	title: "نتائج طلابنا وقصص نجاحهم",
	description:
		"قصص نجاح طلاب الأستاذ محمد صبح (Mohammed Subuh) في الفيزياء: نتائجهم وتجاربهم بالصور والفيديو.",
	path: "/results",
	keywords: ["نتائج الطلاب", "قصص نجاح", "محمد صبح", "Mohammed Subuh"],
});

export default async function Page() {
	return <ResultsPage stories={await getStories()} />;
}
