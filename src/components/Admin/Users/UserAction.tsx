"use client";
import DeleteModal from "@/components/Common/Modals/DeleteModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteUser, updateUser } from "@/actions/user";

const arrowIcon = (
	<svg
		width='20'
		height='20'
		viewBox='0 0 16 16'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M2.95339 5.67461C3.1331 5.46495 3.44875 5.44067 3.65841 5.62038L7.99968 9.34147L12.341 5.62038C12.5506 5.44067 12.8663 5.46495 13.046 5.67461C13.2257 5.88428 13.2014 6.19993 12.9917 6.37964L8.32508 10.3796C8.13783 10.5401 7.86153 10.5401 7.67429 10.3796L3.00762 6.37964C2.79796 6.19993 2.77368 5.88428 2.95339 5.67461Z'
			fill='white'
		/>
	</svg>
);

export default function UserAction({ user }: any) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [role, setRole] = useState(user.role);
	const [loading, setLodading] = useState(false);
	const router = useRouter();
	const roles = ["ADMIN", "USER"];

	const handleDelete = async () => {
		setLodading(true);
		try {
			await deleteUser(user);
			toast.success("User deleted successfully!");
			router.refresh();
			setLodading(false);
		} catch (error: any) {
			toast.error(error.message);
			setShowDeleteModal(false);
		}
	};

	const handleUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		setRole(e.target.value);
		const role = e.target.value;

		try {
			await updateUser({
				email: user?.email,
				role,
			});

			toast.success("User Role updated successfully!");
			router.refresh();
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<div className='mt-2 flex items-center gap-3.5 lsm:ml-auto lsm:justify-end sm:mt-0'>
				<div className='relative'>
					<select
						onChange={handleUpdate}
						value={role}
						className=' h-10 cursor-pointer appearance-none rounded-lg bg-dark px-3 pr-8 text-center text-white'
					>
						{roles.map((role, index) => (
							<option key={index} value={role} className='cursor-pointer'>
								{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
							</option>
						))}
					</select>

					<span className='absolute right-2 top-1/2 z-10 -translate-y-1/2'>
						{arrowIcon}
					</span>
				</div>
				<button
					onClick={() => setShowDeleteModal(true)}
					className='flex h-10 w-10 items-center justify-center rounded-lg bg-red-light-5 text-red duration-300 hover:bg-red hover:text-white dark:bg-red/10 dark:hover:bg-red'
				>
					<svg
						width='21'
						height='20'
						viewBox='0 0 21 20'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M9.53384 1.87495H12.3517C12.532 1.87484 12.6891 1.87474 12.8375 1.89843C13.4236 1.99202 13.9307 2.35756 14.2049 2.88397C14.2742 3.01721 14.3238 3.16628 14.3807 3.33739L14.4738 3.61647C14.4895 3.66371 14.494 3.67709 14.4978 3.68762C14.6438 4.09105 15.0221 4.36377 15.451 4.37464C15.4623 4.37492 15.4761 4.37497 15.5261 4.37497H18.0261C18.3713 4.37497 18.6511 4.65479 18.6511 4.99997C18.6511 5.34515 18.3713 5.62497 18.0261 5.62497H3.85937C3.5142 5.62497 3.23438 5.34515 3.23438 4.99997C3.23438 4.65479 3.5142 4.37497 3.85937 4.37497H6.35944C6.40948 4.37497 6.42329 4.37492 6.43457 4.37464C6.86344 4.36377 7.2418 4.09107 7.38773 3.68764C7.39156 3.67703 7.39598 3.66395 7.4118 3.61647L7.50481 3.33741C7.56172 3.16631 7.61131 3.01721 7.6807 2.88397C7.95482 2.35756 8.46198 1.99202 9.04806 1.89843C9.19641 1.87474 9.35352 1.87484 9.53384 1.87495ZM8.4495 4.37497C8.49243 4.29079 8.53046 4.20331 8.56319 4.11284C8.57312 4.08537 8.58287 4.05612 8.59539 4.01855L8.67856 3.76904C8.75454 3.54112 8.77203 3.49463 8.78938 3.4613C8.88076 3.28583 9.04981 3.16399 9.24517 3.13279C9.28228 3.12687 9.3319 3.12497 9.57216 3.12497H12.3134C12.5537 3.12497 12.6033 3.12687 12.6404 3.13279C12.8357 3.16399 13.0048 3.28583 13.0962 3.4613C13.1135 3.49463 13.131 3.54111 13.207 3.76904L13.2901 4.0184L13.3224 4.11286C13.3551 4.20332 13.3931 4.29079 13.4361 4.37497H8.4495Z'
							fill='currentColor'
						/>
						<path
							d='M5.87195 7.04173C5.84899 6.69732 5.55117 6.43673 5.20676 6.45969C4.86235 6.48265 4.60176 6.78047 4.62472 7.12488L5.01093 12.918C5.08217 13.9869 5.13972 14.8504 5.2747 15.5279C5.41503 16.2324 5.65371 16.8208 6.14671 17.282C6.63971 17.7432 7.24266 17.9422 7.95487 18.0354C8.63989 18.125 9.50524 18.125 10.5765 18.125H11.309C12.3803 18.125 13.2457 18.125 13.9307 18.0354C14.6429 17.9422 15.2458 17.7432 15.7388 17.282C16.2318 16.8208 16.4705 16.2324 16.6109 15.5279C16.7458 14.8504 16.8034 13.987 16.8746 12.918L17.2608 7.12488C17.2838 6.78047 17.0232 6.48265 16.6788 6.45969C16.3344 6.43673 16.0366 6.69732 16.0136 7.04173L15.6303 12.791C15.5554 13.9142 15.5021 14.6957 15.3849 15.2837C15.2713 15.8541 15.1127 16.156 14.8849 16.3692C14.657 16.5823 14.3452 16.7205 13.7686 16.796C13.1741 16.8737 12.3907 16.875 11.265 16.875H10.6205C9.49484 16.875 8.7115 16.8737 8.117 16.796C7.54033 16.7205 7.22854 16.5823 7.00069 16.3692C6.77285 16.156 6.61424 15.8541 6.50061 15.2837C6.38347 14.6957 6.33011 13.9142 6.25523 12.791L5.87195 7.04173Z'
							fill='currentColor'
						/>
						<path
							d='M8.79726 8.54474C9.14073 8.51039 9.447 8.76098 9.48135 9.10445L9.89802 13.2711C9.93236 13.6146 9.68177 13.9209 9.33831 13.9552C8.99484 13.9895 8.68857 13.739 8.65422 13.3955L8.23755 9.22883C8.20321 8.88536 8.4538 8.57909 8.79726 8.54474Z'
							fill='currentColor'
						/>
						<path
							d='M13.0883 8.54474C13.4318 8.57909 13.6824 8.88536 13.648 9.22883L13.2313 13.3955C13.197 13.739 12.8907 13.9895 12.5473 13.9552C12.2038 13.9209 11.9532 13.6146 11.9876 13.2711L12.4042 9.10445C12.4386 8.76098 12.7448 8.51039 13.0883 8.54474Z'
							fill='currentColor'
						/>
					</svg>
				</button>
			</div>

			<DeleteModal
				showDeleteModal={showDeleteModal}
				setShowDeleteModal={setShowDeleteModal}
				deleteText='Remove User'
				handleDelete={handleDelete}
				loading={loading}
			/>
		</>
	);
}
