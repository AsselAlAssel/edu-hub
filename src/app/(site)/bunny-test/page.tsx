import { getSessionUser } from "@/libs/api";
import { canUseBunnyTest } from "@/libs/bunny";
import { pageMetadata } from "@/libs/site";
import { notFound, redirect } from "next/navigation";
import BunnyTestPlayer from "./BunnyTestPlayer";

// Temporary Bunny Stream experiment: delete this folder and
// src/app/api/bunny-test + src/libs/bunny.ts when done.
export const metadata = pageMetadata({
	title: "Bunny Stream Test",
	description: "صفحة اختبار مؤقتة لتشغيل فيديو محمي من Bunny Stream.",
	path: "/bunny-test",
	noIndex: true,
});

export default async function Page() {
	const user = await getSessionUser();
	if (!user) {
		redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/bunny-test")}`);
	}
	// Other accounts get a plain 404: the page does not exist for them.
	if (!canUseBunnyTest(user)) notFound();
	// Watermark text comes from the server session, never from the browser.
	return <BunnyTestPlayer watermark={user.email ?? user.id} />;
}
