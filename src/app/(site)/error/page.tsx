import NotFound from "@/components/404";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "خطأ",
	description: "حدث خطأ",
};

const ErrorPage = () => {
	return (
		<>
			<NotFound />
		</>
	);
};

export default ErrorPage;
