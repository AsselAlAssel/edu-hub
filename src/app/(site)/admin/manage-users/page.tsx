import UsersListContainer from "@/components/Admin/Users";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Users - ${process.env.SITE_NAME}`,
	description: `Users Description`,
};

export default function UsersPage({
	searchParams,
}: {
	searchParams: { filter: string; search: string };
}) {
	const { filter, search } = searchParams;
	const validFilter =
		filter === "USER" || filter === "ADMIN" ? filter : undefined;

	return (
		<>
			<Breadcrumb pageTitle='Manage Users' />

			<UsersListContainer filter={validFilter} search={search} />
		</>
	);
}
