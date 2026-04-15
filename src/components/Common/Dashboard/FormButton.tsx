export default function FormButton({ height, children }: any) {
	return (
		<button
			type='submit'
			className='flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#0088DD] px-10 py-3.5 text-base font-semibold text-white duration-200 hover:bg-[#006BB3] active:scale-[0.98]'
			style={{ height: height }}
		>
			{children}
		</button>
	);
}
