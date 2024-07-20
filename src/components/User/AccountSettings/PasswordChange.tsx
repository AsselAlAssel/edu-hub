"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "@/components/Common/Loader";

export default function PasswordChange() {
	const [data, setData] = useState({
		currentPassword: "",
		newPassword: "",
		reTypeNewPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const { currentPassword, newPassword } = data;

	const { data: session } = useSession();

	const handleChange = (e: any) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		setLoading(true);

		if (!session?.user) {
			toast.error("Please login first!");
			return;
		}

		try {
			await axios.post("/api/user/change-password", {
				password: newPassword,
				currentPassword: currentPassword,
				email: session?.user?.email,
			});

			toast.success("Password changed successfully");
			setData({
				currentPassword: "",
				newPassword: "",
				reTypeNewPassword: "",
			});
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			toast.error(error?.response?.data);
		}
	};

	return (
		<div className='w-full max-w-[525px]'>
			<Card>
				<h3 className='mb-9 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
					Password
				</h3>

				<form onSubmit={handleSubmit} className='space-y-5.5'>
					<InputGroup
						label='Current password'
						name='currentPassword'
						placeholder='Enter your current password'
						type='password'
						value={data.currentPassword}
						handleChange={handleChange}
						required={true}
					/>

					<InputGroup
						label='New password'
						name='newPassword'
						placeholder='Enter your new password'
						type='password'
						value={data.newPassword}
						handleChange={handleChange}
						required={true}
					/>

					<InputGroup
						label='Re-type new password'
						name='reTypeNewPassword'
						placeholder='Re-type your new password'
						type='password'
						value={data.reTypeNewPassword}
						handleChange={handleChange}
						required={true}
					/>

					<FormButton>
						{loading ? (
							<>
								Changing <Loader style='border-white' />
							</>
						) : (
							"Change Password"
						)}
					</FormButton>
				</form>
			</Card>
		</div>
	);
}
