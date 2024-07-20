export default function ModalCloseButton({ closeModal }: any) {
	return (
		<button
			onClick={() => closeModal(false)}
			className='absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray duration-150 ease-in hover:text-black dark:bg-gray-7 dark:hover:text-white sm:right-7.5 sm:top-7.5'
		>
			<svg
				className='fill-current'
				width='14'
				height='14'
				viewBox='0 0 14 14'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M8.31081 6.99994L13.2291 2.08161C13.5866 1.72411 13.5866 1.12827 13.2291 0.770773C13.0543 0.598884 12.8189 0.502563 12.5737 0.502563C12.3285 0.502563 12.0932 0.598884 11.9183 0.770773L6.99998 5.68911L2.08164 0.770773C1.90679 0.598884 1.67142 0.502563 1.42623 0.502563C1.18104 0.502563 0.94566 0.598884 0.770811 0.770773C0.413311 1.12827 0.413311 1.72411 0.770811 2.08161L5.68914 6.99994L0.770811 11.9183C0.413311 12.2758 0.413311 12.8716 0.770811 13.2291C1.12831 13.5866 1.72414 13.5866 2.08164 13.2291L6.99998 8.31077L11.9183 13.2291C12.2758 13.5866 12.8716 13.5866 13.2291 13.2291C13.5866 12.8716 13.5866 12.2758 13.2291 11.9183L8.31081 6.99994Z'
					fill=''
				/>
			</svg>
		</button>
	);
}
