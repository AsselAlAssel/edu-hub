import Link from "next/link";

type PropsType = { pageTitle: string };

export default function Breadcrumb({ pageTitle }: PropsType) {
	return (
		<div className='mb-7.5 items-center justify-between md:flex'>
			<h2 className='mb-4 font-satoshi text-2xl font-bold text-dark dark:text-white md:mb-0'>
				{pageTitle}
			</h2>

			<div>
				<ul className='flex items-center md:justify-end'>
					<li>
						<Link
							href='/'
							className='text-sm text-body hover:text-primary dark:text-gray-5 dark:hover:text-primary'
						>
							Home
						</Link>
					</li>

					<li className='text-sm text-body dark:text-gray-5'>
						<span className='px-2'>/</span>
						{pageTitle}
					</li>
				</ul>
			</div>
		</div>
	);
}
