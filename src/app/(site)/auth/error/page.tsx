import { pageMetadata } from "@/libs/site";
import SigninErrorRedirect from "./SigninErrorRedirect";

export const metadata = pageMetadata({
	title: "تسجيل الدخول",
	description: "تعذّر تسجيل الدخول.",
	path: "/auth/error",
	noIndex: true,
});

/** NextAuth's sign-in and error page: bounces straight back with a toast. */
export default function SigninErrorPage() {
	return <SigninErrorRedirect />;
}
