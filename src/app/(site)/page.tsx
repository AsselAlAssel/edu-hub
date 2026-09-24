import { getLandingData } from "@/actions/landing";
import { pageMetadata } from "@/libs/site";
import Landing from "@/scenes/Landing";

export const revalidate = 60;

export const metadata = {
	...pageMetadata({
		title: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
		description:
			"شروحات الفيزياء لجميع الصفوف من إعداد الأستاذ محمد صبح (Mohammed Subuh): فيديوهات وملفات منظّمة حسب الصف لتفهم الفيزياء بأسلوب بسيط وواضح.",
		path: "/",
		keywords: [
			"شروحات الفيزياء",
			"محمد صبح",
			"فيزياء محمد صبح",
			"الأستاذ محمد صبح",
			"دروس الفيزياء",
			"تعليم الفيزياء",
			"Mohammed Subuh",
			"Mohammed Subuh physics",
		],
	}),
	// The root layout's title template must not wrap the home title.
	title: {
		absolute: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
	},
};

export default async function LandingPage() {
	const data = await getLandingData();
	return <Landing data={data} />;
}
