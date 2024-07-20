"use client";
import { DataStats } from "@/staticData/statsData";

export default function DataStatsCard({ data }: { data: DataStats }) {
	const { icon, value, content, color, isIncrease, percents } = data;

	return (
		<div className='rounded-10 bg-white p-6 shadow-1 dark:bg-gray-dark'>
			<div
				className='mb-6 flex aspect-square w-[58px] items-center justify-center rounded-full text-white'
				style={{ background: color }}
			>
				{icon}
			</div>

			<div>
				<h3 className='font-satoshi text-2xl font-bold text-dark dark:text-white'>
					{value}
				</h3>

				<div className='flex items-center justify-between'>
					<p className='font-satoshi text-sm font-medium text-body dark:text-gray-4'>
						{content}
					</p>

					<p
						className={`flex items-center gap-1.5 font-satoshi text-sm font-medium ${
							isIncrease ? "text-[#00BC55]" : "text-red"
						}`}
					>
						{percents}
						<span className={`${isIncrease ? "" : "rotate-180"}`}>
							<svg
								width='10'
								height='10'
								viewBox='0 0 10 10'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z'
									fill='currentColor'
								/>
							</svg>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
