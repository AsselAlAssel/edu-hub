"use client";
import React, { useState } from "react";
import EditProfile from "./EditProfile";
import PasswordChange from "./PasswordChange";
import DeleteAccount from "./DeleteAccount";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import DeleteModal from "@/components/Common/Modals/DeleteModal";

const AccountSettings = () => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const { data: session } = useSession();

	const handleDelete = async () => {
		setLoading(true);
		try {
			await axios.delete("/api/user/delete", {
				data: {
					email: session?.user?.email,
				},
			});

			toast.success("Account deleted successfully");
			setLoading(false);
			window.location.href = "/";
		} catch (error: any) {
			setLoading(false);
			toast.error(error.response.data);
		}

		// Reset the state
		setShowDeleteModal(false);
	};

	return (
		<>
			<div className='flex flex-col gap-y-10 lg:gap-x-10  xl:flex-row'>
				<EditProfile />
				<PasswordChange />

				<DeleteModal
					showDeleteModal={showDeleteModal}
					setShowDeleteModal={setShowDeleteModal}
					deleteText='Delete Account'
					handleDelete={handleDelete}
					loading={loading}
				/>
			</div>
			<div className='mt-10'>
				<DeleteAccount
					setShowDeleteModal={setShowDeleteModal}
					showDeleteModal={showDeleteModal}
				/>
			</div>
		</>
	);
};

export default AccountSettings;
