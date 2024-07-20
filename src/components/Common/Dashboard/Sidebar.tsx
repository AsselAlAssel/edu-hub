"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
	sidebarOthersData,
	sidebarData,
	sidebarRef,
}: any) {
	const pathname = usePathname();

	return (
		<>
			<div
				ref={sidebarRef}
				className='h-full border-r border-stroke px-6 py-10 dark:border-stroke-dark'
			>
				<Link href='/' className='mb-10 inline-block'>
					<Image
						src={"/images/logo/logo.svg"}
						alt='logo'
						className='block dark:hidden'
						width={193}
						height={34}
					/>
					<Image
						src={"/images/logo/logo-light.svg"}
						alt='logo'
						className='hidden dark:block'
						width={193}
						height={34}
					/>
				</Link>
				<div className='mb-6'>
					<p className='mb-4 font-satoshi text-sm font-medium uppercase text-body dark:text-gray-6'>
						Main menu
					</p>
					<ul className='space-y-2'>
						{sidebarData &&
							sidebarData?.map((item: any, key: number) => (
								<li key={key}>
									<Link
										href={`${item?.path}`}
										className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 font-satoshi font-medium duration-300 ${
											pathname === `${item.path}`
												? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
												: "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
										}`}
									>
										<span className='h-[24px] w-[24px]'>{item?.icon}</span>
										{item?.title}

										{item?.comingSoon && (
											<span
												className={`rounded-lg px-1.5 text-sm  ${
													pathname == `${item.path}`
														? "bg-white/[.08] text-white"
														: "bg-primary/[.08] text-primary"
												}`}
											>
												{" "}
												Soon
											</span>
										)}
									</Link>
								</li>
							))}
					</ul>
				</div>
				{sidebarOthersData && (
					<div>
						<p className='mb-4 font-satoshi text-sm font-medium uppercase text-body dark:text-gray-6'>
							Others
						</p>
						<ul className='space-y-2'>
							{sidebarOthersData?.map((item: any) => (
								<li key={item?.id}>
									<Link
										href={`${item?.path}`}
										className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 font-satoshi font-medium duration-300 ${
											pathname === `${item.path}`
												? "bg-primary bg-opacity-10 text-primary dark:bg-white dark:bg-opacity-10 dark:text-white"
												: "text-dark hover:bg-primary hover:bg-opacity-10 hover:text-primary dark:text-gray-5 dark:hover:bg-white dark:hover:bg-opacity-10 dark:hover:text-white"
										}`}
									>
										<span>{item?.icon}</span>
										{item?.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}
