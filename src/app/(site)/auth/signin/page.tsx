import Signin from "@/components/Auth/Signin";
import { authOptions } from "@/libs/auth";
import { pageMetadata } from "@/libs/site";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = pageMetadata({
	title: "تسجيل الدخول",
	description: "تسجيل الدخول إلى منصة محمد صبح للفيزياء.",
	path: "/auth/signin",
	noIndex: true,
});

export default async function SigninPage({
	searchParams,
}: {
	searchParams: Promise<{ signOut?: string }>;
}) {
	// Already signed in → skip the form (unless this is the forced sign-out flow).
	const [session, { signOut }] = await Promise.all([
		getServerSession(authOptions),
		searchParams,
	]);
	if (session && !signOut) redirect("/classes");

	return <Signin />;
}
