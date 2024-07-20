"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getSignedURL } from "@/actions/upload";
import Loader from "@/components/Common/Loader";

export default function EditProfile() {
	const { data: session, update } = useSession();
	const [data, setData] = useState({
		name: session?.user.name as string,
		email: "",
		profilePhoto: "",
	});
	const [file, setFile] = useState<File>();
	const [loading, setLoading] = useState(false);
	const isDemo = session?.user?.email?.includes("demo-");

	const handleChange = (e: any) => {
		if (e.target.name === "profilePhoto") {
			const file = e.target?.files[0];
			setData({
				...data,
				profilePhoto: file && URL.createObjectURL(file),
			});
			setFile(file);
		} else {
			setData({
				...data,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleFileUpload = async (file: any) => {
		if (!file) {
			return null;
		}

		const signedUrl = await getSignedURL(file.type, file.size);

		if (signedUrl.failure !== undefined) {
			toast.error(signedUrl.failure);
			setFile(undefined);
			setData({
				...data,
				profilePhoto: "",
			});
			return null;
		}

		const url = signedUrl.success.url;

		try {
			const res = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": file.type || "application/octet-stream",
				},
				body: file,
			});

			if (res.status === 200) {
				// toast.success("Profile photo uploaded successfully");
				return signedUrl?.success?.key;
			}
		} catch (error) {
			console.error("Error uploading profile photo:", error);
			toast.error("Failed to upload profile photo");
		}

		return null;
	};

	const updateUserProfile = async (data: any, uploadedImageUrl: string) => {
		try {
			const requestBody = {
				name: data.name,
				email: data.email,
				image: "",
			};

			if (uploadedImageUrl) {
				requestBody.image = uploadedImageUrl;
			}

			const res = await fetch("/api/user/update", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const updatedUser = await res.json();

			if (res.status === 200) {
				toast.success("Profile updated successfully");
				setLoading(false);
				return updatedUser;
			} else if (res.status === 401) {
				setLoading(false);
				toast.error("Can't update demo user");
			} else {
				setLoading(false);
				toast.error("Failed to update profile");
			}
		} catch (error: any) {
			setLoading(false);
			toast.error(error?.response?.data);
		}

		return null;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isDemo) {
			toast.error("Can't update demo user");
			setData({
				name: "",
				email: "",
				profilePhoto: "",
			});
			return null;
		}

		const uploadedImageUrl = await handleFileUpload(file);
		setLoading(true);

		const updatedUser = await updateUserProfile(
			data,
			uploadedImageUrl as string
		);

		if (updatedUser) {
			await update({
				...session,
				user: {
					...session?.user,
					name: updatedUser.name,
					email: updatedUser.email,
					image: updatedUser.image,
				},
			});

			setData({
				name: "",
				email: "",
				profilePhoto: "",
			});
			window.location.reload();
		}
	};

	return (
		<div className='w-full max-w-[525px]'>
			<Card>
				<h3 className='mb-9 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
					Edit Profile
				</h3>

				<div>
					<div className='relative mb-9 flex items-center gap-8'>
						<label
							htmlFor='profilePhoto'
							className='relative flex aspect-square w-[130px] cursor-pointer items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:bg-gray-3 dark:border-stroke-dark dark:bg-white/5 dark:text-white'
						>
							{data?.profilePhoto ? (
								<>
									<Image
										src={data?.profilePhoto}
										fill
										alt='profile image'
										className='rounded-full'
									/>

									<span className='z-20 text-white'>
										<svg
											width='34'
											height='34'
											viewBox='0 0 34 34'
											fill='currentColor'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												fillRule='evenodd'
												clipRule='evenodd'
												d='M10.7644 6.3561C11.1424 4.50044 12.7937 3.1875 14.6856 3.1875H19.3143C21.2062 3.1875 22.8575 4.50044 23.2355 6.3561C23.3228 6.78448 23.7109 7.09871 24.1145 7.09871H24.1377L24.1609 7.09973C26.1491 7.18667 27.6762 7.43065 28.9512 8.26707C29.7545 8.79406 30.4455 9.47207 30.9839 10.2632C31.6538 11.2476 31.9493 12.3773 32.0908 13.7437C32.2292 15.0787 32.2292 16.7521 32.2291 18.8715V18.9921C32.2292 21.1116 32.2292 22.7849 32.0908 24.1199C31.9493 25.4863 31.6538 26.6161 30.9839 27.6004C30.4455 28.3916 29.7545 29.0696 28.9512 29.5966C27.9546 30.2504 26.8121 30.5386 25.4264 30.677C24.0696 30.8125 22.3678 30.8125 20.2065 30.8125H13.7934C11.6322 30.8125 9.93034 30.8125 8.57359 30.677C7.18785 30.5386 6.04534 30.2504 5.04876 29.5966C4.24547 29.0696 3.55447 28.3916 3.01605 27.6004C2.34615 26.6161 2.05068 25.4863 1.90911 24.1199C1.77079 22.7849 1.7708 21.1116 1.77081 18.9921V18.8715C1.7708 16.7521 1.77079 15.0787 1.90911 13.7437C2.05068 12.3773 2.34615 11.2476 3.01605 10.2632C3.55447 9.47207 4.24547 8.79406 5.04876 8.26707C6.32373 7.43065 7.85086 7.18667 9.83906 7.09973L9.86226 7.09871H9.88547C10.2891 7.09871 10.6772 6.78448 10.7644 6.3561ZM14.6856 5.3125C13.7774 5.3125 13.0178 5.94008 12.8467 6.78026C12.5695 8.141 11.3631 9.21097 9.91145 9.2236C8.00092 9.30848 6.97757 9.54318 6.21439 10.0439C5.64269 10.4189 5.15313 10.9 4.77281 11.4588C4.3816 12.0337 4.1465 12.7688 4.0228 13.9627C3.89715 15.1754 3.89581 16.7388 3.89581 18.9318C3.89581 21.1249 3.89715 22.6882 4.0228 23.9009C4.1465 25.0949 4.3816 25.83 4.77281 26.4048C5.15313 26.9637 5.64269 27.4447 6.21439 27.8198C6.80588 28.2078 7.56277 28.4405 8.78478 28.5625C10.0236 28.6863 11.6194 28.6875 13.8518 28.6875H20.1481C22.3806 28.6875 23.9764 28.6863 25.2152 28.5625C26.4372 28.4405 27.1941 28.2078 27.7856 27.8198C28.3573 27.4447 28.8468 26.9637 29.2271 26.4048C29.6184 25.83 29.8535 25.0949 29.9772 23.9009C30.1028 22.6882 30.1041 21.1249 30.1041 18.9318C30.1041 16.7388 30.1028 15.1754 29.9772 13.9627C29.8535 12.7688 29.6184 12.0337 29.2271 11.4588C28.8468 10.9 28.3573 10.4189 27.7856 10.0439C27.0224 9.54318 25.999 9.30848 24.0885 9.2236C22.6369 9.21097 21.4305 8.141 21.1533 6.78026C20.9822 5.94008 20.2226 5.3125 19.3143 5.3125H14.6856ZM17 13.1042C17.5868 13.1042 18.0625 13.5799 18.0625 14.1667V17.3542H21.25C21.8368 17.3542 22.3125 17.8299 22.3125 18.4167C22.3125 19.0035 21.8368 19.4792 21.25 19.4792H18.0625V22.6667C18.0625 23.2535 17.5868 23.7292 17 23.7292C16.4132 23.7292 15.9375 23.2535 15.9375 22.6667V19.4792H12.75C12.1632 19.4792 11.6875 19.0035 11.6875 18.4167C11.6875 17.8299 12.1632 17.3542 12.75 17.3542H15.9375V14.1667C15.9375 13.5799 16.4132 13.1042 17 13.1042ZM24.4375 14.1667C24.4375 13.5799 24.9132 13.1042 25.5 13.1042H26.9166C27.5034 13.1042 27.9791 13.5799 27.9791 14.1667C27.9791 14.7535 27.5034 15.2292 26.9166 15.2292H25.5C24.9132 15.2292 24.4375 14.7535 24.4375 14.1667Z'
												fill='currentColor'
											/>
										</svg>
									</span>
								</>
							) : (
								<span>
									<svg
										width='34'
										height='34'
										viewBox='0 0 34 34'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M10.7644 6.3561C11.1424 4.50044 12.7937 3.1875 14.6856 3.1875H19.3143C21.2062 3.1875 22.8575 4.50044 23.2355 6.3561C23.3228 6.78448 23.7109 7.09871 24.1145 7.09871H24.1377L24.1609 7.09973C26.1491 7.18667 27.6762 7.43065 28.9512 8.26707C29.7545 8.79406 30.4455 9.47207 30.9839 10.2632C31.6538 11.2476 31.9493 12.3773 32.0908 13.7437C32.2292 15.0787 32.2292 16.7521 32.2291 18.8715V18.9921C32.2292 21.1116 32.2292 22.7849 32.0908 24.1199C31.9493 25.4863 31.6538 26.6161 30.9839 27.6004C30.4455 28.3916 29.7545 29.0696 28.9512 29.5966C27.9546 30.2504 26.8121 30.5386 25.4264 30.677C24.0696 30.8125 22.3678 30.8125 20.2065 30.8125H13.7934C11.6322 30.8125 9.93034 30.8125 8.57359 30.677C7.18785 30.5386 6.04534 30.2504 5.04876 29.5966C4.24547 29.0696 3.55447 28.3916 3.01605 27.6004C2.34615 26.6161 2.05068 25.4863 1.90911 24.1199C1.77079 22.7849 1.7708 21.1116 1.77081 18.9921V18.8715C1.7708 16.7521 1.77079 15.0787 1.90911 13.7437C2.05068 12.3773 2.34615 11.2476 3.01605 10.2632C3.55447 9.47207 4.24547 8.79406 5.04876 8.26707C6.32373 7.43065 7.85086 7.18667 9.83906 7.09973L9.86226 7.09871H9.88547C10.2891 7.09871 10.6772 6.78448 10.7644 6.3561ZM14.6856 5.3125C13.7774 5.3125 13.0178 5.94008 12.8467 6.78026C12.5695 8.141 11.3631 9.21097 9.91145 9.2236C8.00092 9.30848 6.97757 9.54318 6.21439 10.0439C5.64269 10.4189 5.15313 10.9 4.77281 11.4588C4.3816 12.0337 4.1465 12.7688 4.0228 13.9627C3.89715 15.1754 3.89581 16.7388 3.89581 18.9318C3.89581 21.1249 3.89715 22.6882 4.0228 23.9009C4.1465 25.0949 4.3816 25.83 4.77281 26.4048C5.15313 26.9637 5.64269 27.4447 6.21439 27.8198C6.80588 28.2078 7.56277 28.4405 8.78478 28.5625C10.0236 28.6863 11.6194 28.6875 13.8518 28.6875H20.1481C22.3806 28.6875 23.9764 28.6863 25.2152 28.5625C26.4372 28.4405 27.1941 28.2078 27.7856 27.8198C28.3573 27.4447 28.8468 26.9637 29.2271 26.4048C29.6184 25.83 29.8535 25.0949 29.9772 23.9009C30.1028 22.6882 30.1041 21.1249 30.1041 18.9318C30.1041 16.7388 30.1028 15.1754 29.9772 13.9627C29.8535 12.7688 29.6184 12.0337 29.2271 11.4588C28.8468 10.9 28.3573 10.4189 27.7856 10.0439C27.0224 9.54318 25.999 9.30848 24.0885 9.2236C22.6369 9.21097 21.4305 8.141 21.1533 6.78026C20.9822 5.94008 20.2226 5.3125 19.3143 5.3125H14.6856ZM17 13.1042C17.5868 13.1042 18.0625 13.5799 18.0625 14.1667V17.3542H21.25C21.8368 17.3542 22.3125 17.8299 22.3125 18.4167C22.3125 19.0035 21.8368 19.4792 21.25 19.4792H18.0625V22.6667C18.0625 23.2535 17.5868 23.7292 17 23.7292C16.4132 23.7292 15.9375 23.2535 15.9375 22.6667V19.4792H12.75C12.1632 19.4792 11.6875 19.0035 11.6875 18.4167C11.6875 17.8299 12.1632 17.3542 12.75 17.3542H15.9375V14.1667C15.9375 13.5799 16.4132 13.1042 17 13.1042ZM24.4375 14.1667C24.4375 13.5799 24.9132 13.1042 25.5 13.1042H26.9166C27.5034 13.1042 27.9791 13.5799 27.9791 14.1667C27.9791 14.7535 27.5034 15.2292 26.9166 15.2292H25.5C24.9132 15.2292 24.4375 14.7535 24.4375 14.1667Z'
											fill='currentColor'
										/>
									</svg>
								</span>
							)}

							<input
								type='file'
								name='profilePhoto'
								id='profilePhoto'
								className='sr-only'
								onChange={handleChange}
								accept='image/png, image/jpg, image/jpeg'
							/>
						</label>

						{!file && (
							<p>
								Recommended size: 300px X 300px <br /> Supported format: jpg,
								jpeg, png <br /> Max size: 2mb
							</p>
						)}
					</div>

					<form onSubmit={handleSubmit} className='space-y-5.5'>
						<InputGroup
							label='Your Name'
							name='name'
							placeholder='Enter Your Name'
							value={data.name}
							type='text'
							handleChange={handleChange}
						/>

						<InputGroup
							label='Email Address'
							name='email'
							placeholder='Enter Your Email Address'
							value={data.email}
							type='email'
							handleChange={handleChange}
						/>

						<FormButton>
							{loading ? (
								<>
									Saving <Loader style='border-white' />
								</>
							) : (
								"Save Changes"
							)}
						</FormButton>
					</form>
				</div>
			</Card>
		</div>
	);
}
