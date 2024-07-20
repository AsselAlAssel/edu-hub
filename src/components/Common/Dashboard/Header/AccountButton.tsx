/* eslint-disable @next/next/no-img-element */
import AccountMenu from "../../AccountMenu";

export default function AccountButton({ user }: any) {
	const profilePic = user?.image
		? user.image.includes("http")
			? user.image
			: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
		: "/images/dashboard/profile-avatar.png";

	return (
		<div className='group relative flex items-center'>
			<div className='flex items-center gap-4'>
				<img
					src={profilePic}
					alt='profile name'
					className='h-[48px] w-[48px] overflow-hidden rounded-full'
				/>
				<p className='font-satoshi text-base font-medium capitalize text-dark dark:text-white'>
					{user?.name}
				</p>

				<svg
					className='group-hover:rotate-180'
					width='19'
					height='18'
					viewBox='0 0 19 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M4.29314 6.38394C4.49532 6.14807 4.85042 6.12075 5.0863 6.32293L9.97022 10.5092L14.8542 6.32293C15.09 6.12075 15.4451 6.14807 15.6473 6.38394C15.8495 6.61981 15.8222 6.97492 15.5863 7.17709L10.3363 11.6771C10.1256 11.8576 9.8148 11.8576 9.60415 11.6771L4.35415 7.17709C4.11828 6.97492 4.09097 6.61981 4.29314 6.38394Z'
						fill='currentColor'
					/>
				</svg>
			</div>

			<div className='shadow-3 border-[.5px]border-stroke invisible absolute right-0 top-15 z-999 w-[280px] rounded-lg bg-white pb-2.5 pt-3.5 opacity-0 shadow-md duration-500 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 dark:bg-gray-dark'>
				<AccountMenu user={user} />
			</div>
		</div>
	);
}
