import Classes from "@/components/Admin/Classes";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { getClasses } from "@/libs/class";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: `Dashboard - ${process.env.SITE_NAME}`,
	description: `Dashboard Description`,
};

const ClassesSection = async () => {
	const classes = await getClasses();
	return <Classes classes={classes} />;
};

export default async function ClassesPage() {
	return (
		<>
			<Breadcrumb pageTitle='Dashboard' />
			<Suspense fallback={<div>Loading...</div>}>
				<ClassesSection />
			</Suspense>
		</>
	);
}
