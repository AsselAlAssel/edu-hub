import { getClasses } from "@/libs/class";
import { pageMetadata } from "@/libs/site";
import ProgressPage from "@/scenes/ProgressPage";

// Class totals are shared and cached like /classes; the student's own
// progress loads on the client.
export const revalidate = 60;

export const metadata = pageMetadata({
	title: "تقدّمي",
	description: "تقدّمك في شروحات الفيزياء.",
	path: "/progress",
	noIndex: true,
});

export default async function Page() {
	return <ProgressPage classes={await getClasses()} />;
}
