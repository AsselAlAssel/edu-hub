import Link from "next/link";
import React from "react";

const SocialShare = ({ url }: { url: string }) => {
	return (
		<>
			<Link
				href={`https://twitter.com/intent/post?url=${url}`}
				className='flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-gray-6 duration-200 ease-in hover:border-black hover:bg-black hover:text-white dark:border-stroke-dark'
			>
				<svg
					className='fill-current'
					width='21'
					height='18'
					viewBox='0 0 21 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M7.15321 0.25L11.522 5.84375L16.5757 0.25H19.6432L12.9445 7.66375L20.8245 17.75H14.652L9.81946 11.6338L4.28821 17.75H1.21946L8.38821 9.8225L0.824463 0.25H7.15321ZM6.22821 1.93375H4.40696L15.5007 15.9738H17.2007L6.22821 1.93375Z' />
				</svg>
			</Link>

			<Link
				href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
				className='flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-gray-6 duration-200 ease-in hover:border-black hover:bg-black hover:text-white dark:border-stroke-dark'
			>
				<svg
					className='fill-current'
					width='21'
					height='20'
					viewBox='0 0 21 20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M10.8245 0.060791C5.30161 0.060791 0.824463 4.53794 0.824463 10.0608C0.824463 15.0521 4.48131 19.1891 9.26198 19.9393V12.9514H6.72289V10.0608H9.26198V7.85767C9.26198 5.35142 10.7549 3.96704 13.0391 3.96704C14.1332 3.96704 15.2776 4.16235 15.2776 4.16235V6.62329H14.0166C12.7744 6.62329 12.387 7.39413 12.387 8.18499V10.0608H15.1604L14.7171 12.9514H12.387V19.9393C17.1676 19.1891 20.8245 15.0521 20.8245 10.0608C20.8245 4.53794 16.3473 0.060791 10.8245 0.060791Z' />
				</svg>
			</Link>

			<Link
				href={`https://linkedin.com/share?url=${url}`}
				className='flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-gray-6 duration-200 ease-in hover:border-black hover:bg-black hover:text-white dark:border-stroke-dark'
			>
				<svg
					className='fill-current'
					width='20'
					height='18'
					viewBox='0 0 20 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M4.29448 2.00042C4.29411 2.81473 3.80008 3.54751 3.04534 3.85322C2.2906 4.15894 1.42587 3.97654 0.858904 3.39204C0.291934 2.80753 0.135954 1.93764 0.464504 1.19256C0.793064 0.447478 1.54054 -0.0240123 2.35448 0.000417671C3.43555 0.0328677 4.29497 0.918858 4.29448 2.00042ZM4.35448 5.48042H0.354483V18.0004H4.35448V5.48042ZM10.6745 5.48042H6.69448V18.0004H10.6345V11.4304C10.6345 7.77039 15.4045 7.43039 15.4045 11.4304V18.0004H19.3545V10.0704C19.3545 3.90042 12.2945 4.13042 10.6345 7.16039L10.6745 5.48042Z' />
				</svg>
			</Link>
		</>
	);
};

export default SocialShare;
