/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import { userMenuData, adminMenuData } from "@/staticData/sidebarData";
import { usePathname } from "next/navigation";

const AccountMenu = ({ user }: any) => {
	const pathname = usePathname();
	const sidebarData = user?.role === "USER" ? userMenuData : adminMenuData;

	const profilePic = user?.image
		? user.image.includes("http")
			? user.image
			: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
		: "/images/dashboard/profile-avatar.png";

	return (
		<>
			<div className='mb-2 flex items-center border-b border-stroke px-6 pb-3.5 dark:border-stroke-dark'>
				<div className='mr-3'>
					<img
						src={profilePic}
						alt={user?.name || "profile"}
						className='h-[48px] w-[48px] overflow-hidden rounded-full'
					/>
				</div>
				<div>
					<p className='font-satoshi text-base font-medium text-dark dark:text-white'>
						{user?.name}
					</p>
					<p className='text-sm text-body dark:text-gray-5'>{user?.email}</p>
				</div>
			</div>
			{/* px-2.5 */}
			<div>
				<ul className=''>
					{sidebarData?.map((item: any) => (
						<li key={item?.id} className='mx-2.5 mb-1'>
							<Link
								href={`${item?.path}`}
								className={`flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 font-satoshi font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white ${
									pathname === item?.path
										? "bg-gray-2 text-dark dark:bg-primary dark:text-white"
										: ""
								}`}
							>
								<span>{item?.icon}</span>
								{item?.title}
							</Link>
						</li>
					))}
					<li className='mt-2.5 border-t border-stroke pt-2.5 dark:border-stroke-dark'>
						<button className='mx-2.5 w-[92%]' onClick={() => signOut()}>
							<span className='flex w-full items-center gap-2 rounded-lg px-3.5 py-2 font-satoshi font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'>
								<span>
									<svg
										width='18'
										height='18'
										viewBox='0 0 18 18'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<g clipPath='url(#clip0_2251_109)'>
											<path
												d='M11.209 0.9375C10.1833 0.937485 9.35657 0.937473 8.70635 1.02489C8.03127 1.11566 7.46286 1.30983 7.01142 1.76126C6.61773 2.15496 6.4188 2.63877 6.31437 3.20727C6.2129 3.75969 6.19349 4.43572 6.18897 5.24687C6.18724 5.55753 6.43768 5.81076 6.74833 5.81249C7.05899 5.81422 7.31223 5.56379 7.31396 5.25313C7.31852 4.43301 7.33982 3.8517 7.42086 3.41051C7.49895 2.9854 7.62433 2.73935 7.80692 2.55676C8.01449 2.34919 8.30592 2.21385 8.85625 2.13986C9.42276 2.0637 10.1736 2.0625 11.2502 2.0625H12.0002C13.0767 2.0625 13.8276 2.0637 14.3941 2.13986C14.9444 2.21385 15.2358 2.34919 15.4434 2.55676C15.651 2.76433 15.7863 3.05576 15.8603 3.60609C15.9365 4.1726 15.9377 4.92344 15.9377 6V12C15.9377 13.0766 15.9365 13.8274 15.8603 14.3939C15.7863 14.9442 15.651 15.2357 15.4434 15.4432C15.2358 15.6508 14.9444 15.7862 14.3941 15.8601C13.8276 15.9363 13.0767 15.9375 12.0002 15.9375H11.2502C10.1736 15.9375 9.42276 15.9363 8.85625 15.8601C8.30592 15.7862 8.01449 15.6508 7.80692 15.4432C7.62433 15.2607 7.49895 15.0146 7.42086 14.5895C7.33982 14.1483 7.31852 13.567 7.31396 12.7469C7.31223 12.4362 7.05899 12.1858 6.74833 12.1875C6.43768 12.1892 6.18724 12.4425 6.18897 12.7531C6.19349 13.5643 6.2129 14.2403 6.31437 14.7927C6.4188 15.3612 6.61773 15.845 7.01142 16.2387C7.46286 16.6902 8.03127 16.8843 8.70635 16.9751C9.35657 17.0625 10.1833 17.0625 11.209 17.0625H12.0413C13.067 17.0625 13.8937 17.0625 14.544 16.9751C15.2191 16.8843 15.7875 16.6902 16.2389 16.2387C16.6903 15.7873 16.8845 15.2189 16.9753 14.5438C17.0627 13.8936 17.0627 13.0668 17.0627 12.0412V5.95885C17.0627 4.93316 17.0627 4.10641 16.9753 3.45619C16.8845 2.78111 16.6903 2.2127 16.2389 1.76126C15.7875 1.30983 15.2191 1.11566 14.544 1.02489C13.8938 0.937473 13.067 0.937485 12.0413 0.9375H11.209Z'
												fill='currentColor'
											/>
											<path
												d='M11.25 8.4375C11.5607 8.4375 11.8125 8.68934 11.8125 9C11.8125 9.31066 11.5607 9.5625 11.25 9.5625H3.02058L4.49107 10.8229C4.72694 11.0251 4.75426 11.3802 4.55208 11.6161C4.34991 11.8519 3.9948 11.8793 3.75893 11.6771L1.13393 9.42708C1.00925 9.32022 0.9375 9.16421 0.9375 9C0.9375 8.83579 1.00925 8.67978 1.13393 8.57292L3.75893 6.32292C3.9948 6.12074 4.34991 6.14806 4.55208 6.38393C4.75426 6.6198 4.72694 6.97491 4.49107 7.17708L3.02058 8.4375H11.25Z'
												fill='currentColor'
											/>
										</g>
										<defs>
											<clipPath id='clip0_2251_109'>
												<rect width='18' height='18' rx='5' fill='white' />
											</clipPath>
										</defs>
									</svg>
								</span>
								Logout
							</span>
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default AccountMenu;
