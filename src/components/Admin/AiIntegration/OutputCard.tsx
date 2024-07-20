import Card from "@/components/Common/Dashboard/Card";
import CopyToClipboard from "@/components/Common/CopyToClipboard";

export default function OutputCard({ generated }: any) {
	return (
		<div className='w-3/4'>
			<Card>
				<div className='mb-6 items-end justify-between sm:flex'>
					<div className='mb-6 sm:mb-0'>
						<h3 className='mb-1.5 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
							Output Result
						</h3>
						<p className='text-body'>
							Enjoy your outstanding content based on your topic
						</p>
					</div>
					<div>
						<CopyToClipboard text={generated} label='Copy' />
					</div>
				</div>

				<div>
					<textarea
						defaultValue={generated}
						name='result'
						placeholder='Your generated response will appear here...'
						className='h-[422px] w-full rounded-lg border border-gray-3 px-5.5 py-3 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-transparent dark:text-white dark:focus:border-transparent'
					></textarea>
				</div>
			</Card>
		</div>
	);
}
