import React from "react";
import Support from "@/components/Support";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Support - ${process.env.SITE_NAME}`,
	description: `This is Support page for ${process.env.SITE_NAME}`,
	// other discriptions
};

const SupportPage = () => {
	return (
		<main>
			<Support />
		</main>
	);
};

export default SupportPage;
