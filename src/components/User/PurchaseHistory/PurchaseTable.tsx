// import { Price } from "@/types/priceItem";

export default function PurchaseTable({ data }: any) {
	return (
		<div className='rounded-10 bg-white shadow-1 dark:bg-gray-dark'>
			<div>
				<table className='w-full'>
					<thead className='border-b border-stroke dark:border-stroke-dark'>
						<tr>
							<th className='p-5 pl-7.5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 sm:min-w-[200px]'>
								Plan
							</th>
							<th className='hidden p-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								Next Billing Date
							</th>
							<th className='hidden p-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 md:table-cell'>
								Transaction ID
							</th>
							<th className='hidden p-5 text-left font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5 xl:table-cell'>
								Total amount
							</th>
							<th className='hidden p-5 pr-7.5 text-right font-satoshi text-base font-medium tracking-[-.2px] text-body dark:text-gray-5'>
								Action
							</th>
						</tr>
					</thead>

					<tbody>
						<tr className='border-b border-stroke last-of-type:border-none dark:border-stroke-dark'>
							<td className='p-5 pl-7.5 text-left tracking-[-.16px] text-dark dark:text-white'>
								<span className='text-body dark:text-gray-5 xl:hidden'>
									Name:{" "}
								</span>
								{data?.nickname}
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>
										Next Billing Date:{" "}
									</span>
									{new Date(
										data?.stripeCurrentPeriodEnd as Date
									).toDateString()}
								</span>
								<span className='block md:hidden'>
									<span className='text-body dark:text-gray-5'>
										Transaction ID:
									</span>
									{data?.stripeSubscriptionId}
								</span>
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>Amount:</span>$
									{data?.unit_amount / 100}{" "}
								</span>
								<span className='block xl:hidden'>
									<span className='text-body dark:text-gray-5'>Action:</span>
									<button className='ml-auto flex h-8.5 items-center justify-center rounded-md bg-primary px-4.5 font-satoshi text-sm font-medium tracking-[-.1px] text-white duration-300 hover:bg-primary-dark'>
										Download
									</button>
								</span>
							</td>
							<td className='hidden p-5 text-left tracking-[-.16px] text-dark dark:text-white xl:table-cell'>
								{new Date(data?.stripeCurrentPeriodEnd as Date).toDateString()}
							</td>
							<td className='hidden p-5 text-left tracking-[-.16px] text-dark dark:text-white md:table-cell'>
								{data?.stripeSubscriptionId}
							</td>
							<td className='hidden p-5 text-left tracking-[-.16px] text-dark dark:text-white xl:table-cell'>
								${data?.unit_amount / 100}
							</td>
							<td className='hidden p-5 pr-7.5 text-right tracking-[-.16px] text-dark dark:text-white'>
								<button className='ml-auto flex h-8.5 items-center justify-center rounded-md bg-primary px-4.5 font-satoshi text-sm font-medium tracking-[-.1px] text-white duration-300 hover:bg-primary-dark'>
									Download
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
