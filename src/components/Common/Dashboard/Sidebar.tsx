"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarListItem from "./SidebarListItem";

export default function Sidebar({
	sidebarOthersData,
	sidebarData,
	sidebarRef,
	hideOrgPage,
}: any) {
	const pathname = usePathname();

	return (
		<>
			<div ref={sidebarRef} className='h-full  bg-[#FAFAFA] px-6 py-10'>
				<Link href='/' className='mb-10 inline-block'>
					<Image
						src={"/images/logo/logo.svg"}
						alt='logo'
						className='block dark:hidden'
						width={193}
						height={34}
					/>
				</Link>
				<div className='mb-6'>
					<p className='mb-4  text-sm font-medium uppercase text-body dark:text-gray-6'>
						Main menu
					</p>
					<ul className='space-y-2'>
						{sidebarData &&
							sidebarData?.map((item: any, key: number) =>
								<SidebarListItem key={key} item={item} pathname={pathname} />
							)}
					</ul>
				</div>
				{sidebarOthersData && (
					<div>
						<p className='mb-4  text-sm font-medium uppercase text-body dark:text-gray-6'>
							Others
						</p>
						<ul className='space-y-2'>
							{sidebarOthersData?.map((item: any, key: number) => (
								<SidebarListItem key={key}
									item={item} pathname={pathname} />
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}
