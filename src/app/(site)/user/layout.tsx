"use client";
import Header from "@/components/Common/Dashboard/Header";
import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main>
			<Header />
			<div
				style={{
					paddingTop: `120px`,
				}}
			>
				{children}
			</div>
		</main>
	);
};

export default AdminLayout;
