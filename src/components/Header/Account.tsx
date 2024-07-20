/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useSession } from "next-auth/react";
import AccountMenu from "../Common/AccountMenu";

const Account = ({ navbarOpen }: { navbarOpen: boolean }) => {
	const [dropdown, setDropdown] = useState(false);
	const { data: session } = useSession();

	return (
		<div className='group relative block'>
			<button
				onClick={() => setDropdown(!dropdown)}
				className={`ml-5 flex items-center rounded-lg bg-primary px-5 py-2 font-satoshi font-medium text-white hover:bg-primary-dark `}
			>
				Account
				<svg
					className='ml-1.5 group-hover:rotate-180'
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
			</button>

			<div
				className={`border-[.5px]border-stroke absolute left-5 top-full z-9999 w-[280px] rounded-lg bg-white pb-2.5 pt-3.5 shadow-md duration-500 dark:bg-gray-dark lg:invisible lg:absolute lg:left-auto lg:right-0 lg:opacity-0 lg:group-hover:visible lg:group-hover:translate-y-2 lg:group-hover:opacity-100 ${
					navbarOpen && dropdown
						? "visible mb-4 opacity-100"
						: "invisible opacity-0"
				}`}
			>
				<AccountMenu user={session?.user} />
			</div>
		</div>
	);
};

export default Account;
