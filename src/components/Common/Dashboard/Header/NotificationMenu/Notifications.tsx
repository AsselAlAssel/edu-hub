"use client";
import { useState, useEffect, useRef } from "react";
import Notification from "./NotificationItem";
import Link from "next/link";
export default function Notifications({ role }: { role: string }) {
	const [showNotification, setShowNotification] = useState(false);
	const [showDot, setShowDot] = useState(true);

	const handleShowNotification = () => {
		setShowNotification(!showNotification);
		setShowDot(false);
	};

	// ===== click outside of modal =====
	const divRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleClickOutside = (event: MouseEvent) => {
				if (divRef.current && !divRef.current.contains(event.target as Node)) {
					setShowNotification(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	});

	const count = [1, 2, 3];
	const link =
		role === "admin" ? "/admin/notifications" : "/user/notifications";

	return (
		<div className='relative' ref={divRef}>
			<button
				aria-label='Notification'
				onClick={handleShowNotification}
				className='relative hidden aspect-square w-12 cursor-pointer items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:bg-gray-3 dark:border-stroke-dark dark:bg-gray-dark dark:text-white xsm:flex'
			>
				<span
					className={`absolute right-[13px] top-3 aspect-square w-2.5 rounded-full border-2 border-gray-2  bg-red-light dark:border-stroke-dark ${
						!showDot ? "hidden" : ""
					}`}
				></span>
				<svg
					width='20'
					height='20'
					viewBox='0 0 20 20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className='text-dark dark:text-gray'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M9.99999 1.04167C6.43315 1.04167 3.54166 3.93317 3.54166 7.50001V8.08676C3.54166 8.66753 3.36975 9.2353 3.0476 9.71853L2.09043 11.1543C0.979516 12.8207 1.82761 15.0857 3.75977 15.6126C4.38944 15.7843 5.02444 15.9296 5.66311 16.0484L5.66469 16.0527C6.30552 17.7626 8.01828 18.9583 9.99994 18.9583C11.9816 18.9583 13.6944 17.7626 14.3352 16.0527L14.3368 16.0484C14.9755 15.9296 15.6105 15.7844 16.2402 15.6126C18.1724 15.0857 19.0205 12.8207 17.9096 11.1543L16.9524 9.71853C16.6302 9.2353 16.4583 8.66753 16.4583 8.08676V7.50001C16.4583 3.93317 13.5668 1.04167 9.99999 1.04167ZM12.8137 16.2808C10.9445 16.5041 9.05533 16.5041 7.1862 16.2808C7.77866 17.1321 8.80914 17.7083 9.99994 17.7083C11.1907 17.7083 12.2212 17.1321 12.8137 16.2808ZM4.79166 7.50001C4.79166 4.62352 7.12351 2.29167 9.99999 2.29167C12.8765 2.29167 15.2083 4.62352 15.2083 7.50001V8.08676C15.2083 8.91431 15.4533 9.72334 15.9123 10.4119L16.8695 11.8477C17.5071 12.8041 17.0203 14.1042 15.9113 14.4067C12.0411 15.4622 7.95887 15.4622 4.08866 14.4067C2.97964 14.1042 2.49285 12.8041 3.13049 11.8477L4.08766 10.4119C4.5467 9.72334 4.79166 8.91431 4.79166 8.08676V7.50001Z'
						fill='currentColor'
					/>
				</svg>
			</button>

			<div
				className={`${
					showNotification ? "block" : "hidden"
				} absolute left-0 right-0 top-12 z-99999 mx-auto w-[250px] rounded-md bg-white px-4 shadow-md dark:bg-gray-dark dark:shadow-[0px_1px_4px_1px_rgba(255,200,255,0.08)] md:left-auto md:top-17.5 md:w-[400px]`}
			>
				<div className='mb-4'>
					<h3 className='text-md border-b border-stroke p-4 text-dark dark:border-stroke-dark dark:text-white'>
						Notifications
					</h3>
				</div>

				{count.map((notification) => (
					<Notification key={notification} link={link} />
				))}

				<div className='mt-5 flex w-full border-t border-stroke py-4 text-center dark:border-stroke-dark'>
					<Link
						href={link}
						onClick={() => setShowNotification(false)}
						className='text-md w-full rounded-md border border-stroke bg-gray py-3  text-dark hover:bg-gray/40 dark:border-stroke-dark dark:bg-slate-700 dark:text-white'
					>
						See All Notifications
					</Link>
				</div>
			</div>
		</div>
	);
}
