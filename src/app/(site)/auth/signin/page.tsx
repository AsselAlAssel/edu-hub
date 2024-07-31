import React from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
	title: `Sign in - ${process.env.SITE_NAME}`,
	description: `This is Sign in page for ${process.env.SITE_NAME}`,
};

const SigninPage = () => {
	return (
		<PageContainer>
			<Signin />
		</PageContainer>
	);
};

export default SigninPage;
