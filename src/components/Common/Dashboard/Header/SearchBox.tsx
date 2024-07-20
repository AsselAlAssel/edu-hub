export default function SearchBox() {
	return (
		<div className='relative hidden w-full max-w-[300px] md:block'>
			<input
				type='search'
				placeholder='Search'
				className='h-12 w-full rounded-full border border-stroke bg-gray-2 pl-12 pr-5 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-white/5 dark:text-white'
			/>
			<span className='absolute left-5 top-1/2 -translate-y-1/2 text-dark dark:text-white'>
				<svg
					width='18'
					height='18'
					viewBox='0 0 18 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g clipPath='url(#clip0_2251_116)'>
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M8.625 2.0625C5.00063 2.0625 2.0625 5.00063 2.0625 8.625C2.0625 12.2494 5.00063 15.1875 8.625 15.1875C12.2494 15.1875 15.1875 12.2494 15.1875 8.625C15.1875 5.00063 12.2494 2.0625 8.625 2.0625ZM0.9375 8.625C0.9375 4.37931 4.37931 0.9375 8.625 0.9375C12.8707 0.9375 16.3125 4.37931 16.3125 8.625C16.3125 10.5454 15.6083 12.3013 14.4441 13.6487L16.8977 16.1023C17.1174 16.3219 17.1174 16.6781 16.8977 16.8977C16.6781 17.1174 16.3219 17.1174 16.1023 16.8977L13.6487 14.4441C12.3013 15.6083 10.5454 16.3125 8.625 16.3125C4.37931 16.3125 0.9375 12.8707 0.9375 8.625Z'
							fill='currentColor'
						/>
					</g>
					<defs>
						<clipPath id='clip0_2251_116'>
							<rect width='18' height='18' fill='white' />
						</clipPath>
					</defs>
				</svg>
			</span>
		</div>
	);
}
