"use client";
import { useState } from "react";
import Sidebar from "@/components/Common/Dashboard/Sidebar";
import Header from "@/components/Common/Dashboard/Header";
import {
	adminSidebarData,
	adminSidebarOtherData,
} from "@/staticData/sidebarData";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const [openSidebar, setOpenSidebar] = useState(false);
	return (
		<>
			<main className='min-h-screen bg-gray-2 dark:bg-[#151F34]'>
				<aside
					className={`fixed left-0 top-0 z-[999] h-screen w-[290px] overflow-y-auto bg-white duration-300 dark:bg-gray-dark ${
						openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				>
					<Sidebar
						sidebarData={adminSidebarData}
						sidebarOthersData={adminSidebarOtherData}
					/>
				</aside>
				<div
					onClick={() => setOpenSidebar(false)}
					className={`fixed inset-0 z-[99] h-screen w-full bg-dark/80 lg:hidden ${
						openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
				></div>
				<section className='lg:ml-[290px]'>
					<Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
					<div className='p-5 pt-12 md:p-10'>{children}</div>
				</section>
			</main>
		</>
	);
};

export default AdminLayout;
