import DataStatsCard from "@/components/Admin/Dashboard/DataStatsCard";
import GraphCard from "@/components/Admin/Dashboard/GraphCard";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { dataStats, overviewData } from "@/staticData/statsData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Dashboard - ${process.env.SITE_NAME}`,
	description: `Dashboard Description`,
};

export default function AdminDashboard() {
	return (
		<>
			<Breadcrumb pageTitle='Dashboard' />

			<div className='mb-11 grid grid-cols-1 gap-7.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4'>
				{dataStats.map((data) => (
					<DataStatsCard key={data?.id} data={data} />
				))}
			</div>

			<div>
				<div className='mb-7.5'>
					<h3 className='mb-2 font-satoshi text-heading-5 font-bold tracking-[-.5px] text-dark dark:text-white'>
						Overview
					</h3>
					<p className='font-satoshi font-medium tracking-[-.2px] text-body dark:text-gray-4'>
						An overview of your organization’s activity and performance across
						all your projects.
					</p>
				</div>

				<div className='grid gap-7.5 md:grid-cols-2 xl:grid-cols-3'>
					{overviewData.map((data) => (
						<GraphCard key={data?.id} data={data} />
					))}
				</div>
			</div>
		</>
	);
}
