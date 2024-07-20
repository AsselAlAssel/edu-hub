import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import CreateToken from "@/components/User/Api/CreateToken";
import TokenList from "@/components/User/Api/TokenList";
import { Metadata } from "next";
import { getApiKeys } from "@/actions/api-key";

export const metadata: Metadata = {
	title: `API - ${process.env.SITE_NAME}`,
	description: `API Description`,
};

export default async function AdminApiPage() {
	const tokens = await getApiKeys();

	return (
		<>
			<Breadcrumb pageTitle='API' />

			<div className='flex flex-col gap-y-10 lg:flex-row lg:gap-x-8 lg:gap-y-4'>
				<CreateToken />
				<TokenList tokens={tokens} />
			</div>
		</>
	);
}
