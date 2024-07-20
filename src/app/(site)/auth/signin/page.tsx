import React from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Sign in - ${process.env.SITE_NAME}`,
	description: `This is Sign in page for ${process.env.SITE_NAME}`,
};

const SigninPage = () => {
	return (
		<main className='pt-[150px]'>
			<Signin />
		</main>
	);
};

export default SigninPage;
