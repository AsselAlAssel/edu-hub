import React from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
	title: "تسجيل الدخول",
	description: "تسجيل الدخول",
};

const SigninPage = () => {
	return (
		<PageContainer>
			<Signin />
		</PageContainer>
	);
};

export default SigninPage;
