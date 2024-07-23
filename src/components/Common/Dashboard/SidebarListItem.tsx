import Link from "next/link";

export default function SidebarListItem({
	item,
	pathname,
}: {
	item: any;
	pathname: string;
}) {
	return (
		<li>
			<Link
				href={`${item?.path}`}
				className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3  font-medium duration-300 ${
					pathname === `${item.path}`
						? "bg-[#CDF463]  text-black dark:bg-white dark:bg-opacity-10 dark:text-white"
						: "text-dark hover:bg-[#CDF463] hover:bg-opacity-30 hover:text-black dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
				}`}
			>
				<span className='h-[24px] w-[24px]'>{item?.icon}</span>
				{item?.title}
			</Link>
		</li>
	);
}
