import Signin from "@/components/Auth/Signin";
import { authOptions } from "@/libs/auth";
import { pageMetadata } from "@/libs/site";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SigninErrorRedirect from "../error/SigninErrorRedirect";

export const metadata = pageMetadata({
	title: "تسجيل الدخول",
	description: "تسجيل الدخول إلى منصة محمد صبح للفيزياء.",
	path: "/auth/signin",
	noIndex: true,
});

export default async function SigninPage({
	searchParams,
}: {
	searchParams: Promise<{ signOut?: string; error?: string }>;
}) {
	// Already signed in → skip the form (unless this is the forced sign-out flow).
	const [session, { signOut, error }] = await Promise.all([
		getServerSession(authOptions),
		searchParams,
	]);
	// NextAuth sends most Google failures here (?error=OAuth…), not to
	// pages.error: they belong to a student, so bounce them back too.
	if (error && error !== "CredentialsSignin") {
		return <SigninErrorRedirect code={error} />;
	}
	if (session && !signOut) redirect("/classes");

	return <Signin />;
}
