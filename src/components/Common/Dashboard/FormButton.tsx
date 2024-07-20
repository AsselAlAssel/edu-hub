export default function FormButton({ height, children }: any) {
	return (
		<button
			type='submit'
			className='flex w-full items-center justify-center gap-2 rounded-lg bg-dark px-10 py-3.5 font-satoshi text-base font-medium tracking-[-.2px] text-white duration-300 hover:bg-dark/90 dark:bg-white dark:text-dark dark:hover:bg-white/90'
			style={{ height: height }}
		>
			{children}
		</button>
	);
}
