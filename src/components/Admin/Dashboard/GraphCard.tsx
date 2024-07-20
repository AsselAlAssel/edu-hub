"use client";
import { OverviewData } from "@/staticData/statsData";
import ChartOne from "./ChartOne";
import { Suspense } from "react";

export default function GraphCard({ data }: { data: OverviewData }) {
	const { isIncrease } = data;

	return (
		<div className='rounded-10 bg-white p-7.5 shadow-1 dark:bg-gray-dark'>
			<div className='flex items-center justify-between'>
				<div>
					<p className='mb-1.5 font-satoshi text-sm font-medium tracking-[-.1px] text-body dark:text-gray-4'>
						Monthly Recurring Revenue
					</p>
					<h5 className='font-satoshi text-heading-5 font-bold text-dark dark:text-white'>
						$9.1
					</h5>
				</div>
				<div>
					<div
						className={`inline-flex items-center gap-1.5 ${
							isIncrease ? "text-green" : "text-red"
						}`}
					>
						<div
							className={`flex h-6 w-6 items-center justify-center rounded-full ${
								isIncrease
									? "bg-[#E6F9EC] text-green dark:bg-green/10"
									: "bg-red-light-6 text-red dark:bg-red/10"
							}`}
						>
							<span className={`${isIncrease ? "" : "rotate-180"}`}>
								<svg
									width='17'
									height='16'
									viewBox='0 0 17 16'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M7.9597 5.28398L4.46768 8.776L3.54715 7.85547L8.6107 2.79192L13.6743 7.85547L12.7537 8.776L9.26171 5.28398L9.26171 13.2081L7.9597 13.2081L7.9597 5.28398Z'
										fill='currentColor'
									/>
								</svg>
							</span>
						</div>
						<span className='font-satoshi text-sm font-medium'>(+4%)</span>
					</div>
				</div>
			</div>

			<div>
				<Suspense fallback={null}>
					<ChartOne />
				</Suspense>
			</div>
		</div>
	);
}
