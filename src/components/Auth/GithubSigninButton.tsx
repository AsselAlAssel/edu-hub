import { signIn } from "next-auth/react";

export default function GithubSigninButton({ text }: { text: string }) {
	return (
		<button
			onClick={() => signIn("github", { callbackUrl: "/admin" })}
			className='flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-stroke font-satoshi text-base font-medium text-dark duration-300 hover:bg-gray-1 dark:border-stroke-dark dark:text-white dark:hover:bg-white/5 '
		>
			<svg
				width='20'
				height='20'
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<g clipPath='url(#clip0_2140_5115)'>
					<path
						d='M10 0.5625C4.6875 0.5625 0.3125 4.875 0.3125 10.25C0.3125 14.5 3.09375 18.125 6.96875 19.4375C7.46875 19.5312 7.625 19.2187 7.625 19C7.625 18.7812 7.625 18.1562 7.59375 17.3125C4.90625 17.9375 4.34375 16 4.34375 16C3.90625 14.9062 3.25 14.5937 3.25 14.5937C2.375 13.9687 3.28125 13.9687 3.28125 13.9687C4.25 14 4.78125 14.9687 4.78125 14.9687C5.625 16.4687 7.0625 16.0312 7.59375 15.75C7.6875 15.125 7.9375 14.6875 8.21875 14.4375C6.09375 14.2187 3.8125 13.375 3.8125 9.6875C3.8125 8.625 4.21875 7.78125 4.8125 7.125C4.71875 6.90625 4.375 5.90625 4.90625 4.5625C4.90625 4.5625 5.75 4.3125 7.59375 5.5625C8.375 5.34375 9.1875 5.21875 10.0312 5.21875C10.875 5.21875 11.7188 5.3125 12.4688 5.5625C14.3125 4.34375 15.125 4.5625 15.125 4.5625C15.6563 5.875 15.3438 6.90625 15.2188 7.125C15.8438 7.78125 16.2188 8.65625 16.2188 9.6875C16.2188 13.375 13.9375 14.2187 11.8125 14.4375C12.1562 14.75 12.4688 15.375 12.4688 16.25C12.4688 17.5625 12.4375 18.5937 12.4375 18.9062C12.4375 19.1562 12.625 19.4375 13.0938 19.3437C16.9062 18.0625 19.6875 14.4687 19.6875 10.1875C19.6562 4.875 15.3125 0.5625 10 0.5625Z'
						fill='currentColor'
					/>
				</g>
				<defs>
					<clipPath id='clip0_2140_5115'>
						<rect width='20' height='20' fill='white' />
					</clipPath>
				</defs>
			</svg>
			{text} with Github
		</button>
	);
}
