import { pageMetadata } from "@/libs/site";
import SigninErrorRedirect from "./SigninErrorRedirect";

export const metadata = pageMetadata({
	title: "تسجيل الدخول",
	description: "تعذّر تسجيل الدخول.",
	path: "/auth/error",
	noIndex: true,
});

/** NextAuth's error page (pages.error): bounces straight back with a toast. */
export default async function SigninErrorPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;
	return <SigninErrorRedirect code={error ?? null} />;
}
