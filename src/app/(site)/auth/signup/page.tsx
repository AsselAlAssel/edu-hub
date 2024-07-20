import Signup from "@/components/Auth/Signup";

import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Sign up - ${process.env.SITE_NAME}`,
	description: `This is Sign up page for ${process.env.SITE_NAME}`,
};

const SignupPage = () => {
	return (
		<main className='pt-[150px]'>
			<Signup />
		</main>
	);
};

export default SignupPage;
