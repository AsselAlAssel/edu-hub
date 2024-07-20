"use client";
import logoLight from "@/../public/images/logo/logo-light.svg";
import logo from "@/../public/images/logo/logo.svg";
import { Menu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import { menuData } from "./menuData";
import GlobalSearchModal from "../GlobalSearch";
import Account from "./Account";
import { useSession } from "next-auth/react";
import { onScroll } from "@/libs/scrollActive";
import { usePathname } from "next/navigation";

const Header = () => {
	const [stickyMenu, setStickyMenu] = useState(false);
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const { data: session } = useSession();

	const pathUrl = usePathname();

	const handleStickyMenu = () => {
		if (window.scrollY > 0) {
			setStickyMenu(true);
		} else {
			setStickyMenu(false);
		}
	};

	// Navbar toggle
	const [navbarOpen, setNavbarOpen] = useState(false);
	const navbarToggleHandler = () => {
		setNavbarOpen(!navbarOpen);
	};

	useEffect(() => {
		if (window.location.pathname === "/") {
			window.addEventListener("scroll", onScroll);
		}

		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleStickyMenu);
	});

	return (
		<>
			<header
				className={`fixed left-0 top-0 z-999 w-full transition-all duration-300 ease-in-out  ${
					stickyMenu
						? "bg-white py-4 shadow dark:bg-dark xl:py-0"
						: "bg-transparent py-7 xl:py-0"
				}`}
			>
				<div className='relative mx-auto max-w-[1170px] items-center justify-between px-4 sm:px-8 xl:flex xl:px-0'>
					<div className='flex w-full items-center justify-between xl:w-4/12'>
						<Link href='/'>
							<Image
								src={logoLight}
								alt='Logo'
								className='hidden w-full dark:block'
							/>
							<Image src={logo} alt='Logo' className='w-full dark:hidden' />
						</Link>

						{/* <!-- Hamburger Toggle BTN --> */}
						<button
							onClick={navbarToggleHandler}
							aria-label='button for menu toggle'
							className='block xl:hidden'
						>
							<span className='relative block h-5.5 w-5.5 cursor-pointer'>
								<span className='du-block absolute right-0 h-full w-full'>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!w-full delay-300"
										}`}
									></span>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "delay-400 !w-full"
										}`}
									></span>
									<span
										className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!w-full delay-500"
										}`}
									></span>
								</span>
								<span className='du-block absolute right-0 h-full w-full rotate-45'>
									<span
										className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "!h-0 delay-[0]"
										}`}
									></span>
									<span
										className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
											!navbarOpen && "dealy-200 !h-0"
										}`}
									></span>
								</span>
							</span>
						</button>
					</div>

					<div
						className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-8/12 ${
							navbarOpen &&
							"!visible relative mt-4 !h-auto max-h-[400px] overflow-y-scroll rounded-md bg-white p-7.5 shadow-lg dark:bg-gray-dark"
						}`}
					>
						<nav>
							<ul className='flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-2.5'>
								{menuData?.map((item: Menu, key) =>
									!item?.path && item?.submenu ? (
										<Dropdown
											stickyMenu={stickyMenu}
											item={item}
											key={key}
											setNavbarOpen={setNavbarOpen}
										/>
									) : (
										<li
											key={key}
											className={`${
												item?.submenu ? "group relative" : "nav__menu"
											} ${stickyMenu ? "xl:py-4" : "xl:py-6"}`}
										>
											<Link
												onClick={() => setNavbarOpen(false)}
												href={
													item?.path
														? item?.path.includes("#") && !item?.newTab
															? `/${item?.path}`
															: item?.path
														: ""
												}
												target={item?.newTab ? "_blank" : ""}
												rel={item?.newTab ? "noopener noreferrer" : ""}
												className={`flex rounded-full px-[14px] py-[3px] font-satoshi font-medium ${
													pathUrl === item?.path
														? "bg-primary/5 text-primary dark:bg-white/5 dark:text-white"
														: "text-black hover:bg-primary/5 hover:text-primary dark:text-gray-5 dark:hover:bg-white/5 dark:hover:text-white"
												} ${item?.path?.startsWith("#") ? "menu-scroll" : ""}`}
											>
												{item?.title}
											</Link>
										</li>
									)
								)}
							</ul>
						</nav>

						<div className='mt-7 flex flex-wrap items-center lg:mt-0'>
							<button
								onClick={() => setSearchModalOpen(true)}
								className='text-waterloo hidden h-[38px] w-[38px] items-center justify-center rounded-full  sm:flex'
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 18 18'
									fill='currentColor'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clipPath='url(#clip0_369_1884)'>
										<path
											d='M16.9347 15.3963L12.4816 11.7799C14.3168 9.26991 14.1279 5.68042 11.8338 3.41337C10.6194 2.19889 9.00003 1.52417 7.27276 1.52417C5.54549 1.52417 3.92617 2.19889 2.71168 3.41337C0.201738 5.92332 0.201738 10.0256 2.71168 12.5355C3.92617 13.75 5.54549 14.4247 7.27276 14.4247C8.91907 14.4247 10.4574 13.804 11.6719 12.6975L16.179 16.3409C16.287 16.4219 16.4219 16.4759 16.5569 16.4759C16.7458 16.4759 16.9077 16.3949 17.0157 16.26C17.2316 15.9901 17.2046 15.6122 16.9347 15.3963ZM7.27276 13.2102C5.86935 13.2102 4.5739 12.6705 3.57532 11.6719C1.52418 9.62076 1.52418 6.30116 3.57532 4.27701C4.5739 3.27843 5.86935 2.73866 7.27276 2.73866C8.67617 2.73866 9.97162 3.27843 10.9702 4.27701C13.0213 6.32815 13.0213 9.64775 10.9702 11.6719C9.99861 12.6705 8.67617 13.2102 7.27276 13.2102Z'
											fill='currentColor'
										/>
									</g>
									<defs>
										<clipPath id='clip0_369_1884'>
											<rect
												width='17.2727'
												height='17.2727'
												fill='white'
												transform='translate(0.363647 0.363647)'
											/>
										</clipPath>
									</defs>
								</svg>
							</button>

							<ThemeSwitcher />

							{session?.user ? (
								<Account navbarOpen={navbarOpen} />
							) : (
								<>
									<Link
										href='/auth/signin'
										className='px-5 py-2 font-satoshi font-medium text-black dark:text-white'
									>
										Sign In
									</Link>
									<Link
										href='/auth/signup'
										className='rounded-full bg-primary px-5 py-2 font-satoshi font-medium text-white hover:bg-primary-dark'
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
						{/* <!--=== Nav Right End ===--> */}
					</div>
				</div>
			</header>

			<GlobalSearchModal
				searchModalOpen={searchModalOpen}
				setSearchModalOpen={setSearchModalOpen}
			/>
		</>
	);
};

export default Header;
