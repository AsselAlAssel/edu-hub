"use client";
import Header from "@/components/Common/Dashboard/Header";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			{children}
		</main>
	);
};

export default AdminLayout;
