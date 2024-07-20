import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputSelect from "@/components/Common/InputSelect";

const paragraphsCount = [
	{
		label: "1",
		value: 1,
	},
	{
		label: "2",
		value: 2,
	},
	{
		label: "3",
		value: 3,
	},
	{
		label: "4",
		value: 4,
	},
	{
		label: "5",
		value: 5,
	},
];

const contentTypes = [
	{
		label: "Article",
		value: "article",
	},
	{
		label: "Listicles",
		value: "listicles",
	},
	{
		label: "How to guides",
		value: "how-to-guides",
	},
	{
		label: "Tweet",
		value: "tweet",
	},
];

export default function InputCard({ data, handleChange, handleSubmit }: any) {
	return (
		<Card>
			<div className='mb-6'>
				<h3 className='mb-1.5 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
					Content Topic
				</h3>
				<p className='text-body'>What your content will be about?</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-4.5'>
				<div>
					<textarea
						value={data?.topic}
						name='topic'
						onChange={handleChange}
						required
						placeholder='Type your topic'
						className='h-[150px] w-full rounded-lg border border-gray-3 px-5.5 py-3 text-dark outline-none ring-offset-1 duration-300 focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-transparent dark:text-white dark:focus:border-transparent'
					></textarea>
				</div>

				<InputSelect
					name='num'
					label='Number Of Paragraph'
					options={paragraphsCount}
					value={data?.num}
					onChange={handleChange}
				/>

				<InputSelect
					name='type'
					label='Select Your Type'
					options={contentTypes}
					value={data?.type}
					onChange={handleChange}
				/>

				<FormButton>
					<span>
						<svg
							width='20'
							height='20'
							viewBox='0 0 20 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M6.21103 2.26057C6.52333 1.46872 7.64399 1.46873 7.95629 2.26058L8.92409 4.71445C9.01943 4.95621 9.2108 5.14758 9.45256 5.24292L11.9064 6.21072C12.6983 6.52302 12.6983 7.64369 11.9064 7.95599L9.45256 8.92378C9.2108 9.01913 9.01943 9.2105 8.92409 9.45225L7.95629 11.9061C7.64399 12.698 6.52333 12.698 6.21102 11.9061L5.24323 9.45225C5.14788 9.2105 4.95651 9.01913 4.71476 8.92378L2.26088 7.95599C1.46903 7.64368 1.46903 6.52302 2.26088 6.21072L4.71476 5.24292C4.95652 5.14758 5.14788 4.95621 5.24323 4.71445L6.21103 2.26057Z'
								fill='white'
							/>
							<path
								d='M14.1035 11.1597C14.2751 10.7245 14.8909 10.7245 15.0626 11.1597L15.8131 13.0628C15.8655 13.1956 15.9707 13.3008 16.1036 13.3532L18.0066 14.1038C18.4418 14.2754 18.4418 14.8912 18.0066 15.0629L16.1036 15.8134C15.9707 15.8658 15.8655 15.971 15.8131 16.1039L15.0626 18.0069C14.8909 18.4421 14.2751 18.4421 14.1035 18.0069L13.3529 16.1039C13.3005 15.971 13.1953 15.8658 13.0625 15.8134L11.1594 15.0629C10.7242 14.8912 10.7242 14.2754 11.1594 14.1038L13.0625 13.3532C13.1953 13.3008 13.3005 13.1956 13.3529 13.0628L14.1035 11.1597Z'
								fill='white'
							/>
						</svg>
					</span>
					Generate
				</FormButton>
			</form>
		</Card>
	);
}
