"use client";
import { useState, useEffect } from "react";

const CopyToClipboard = ({ text, label }: { text: string; label: string }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 1000);
		}
	}, [copied]);

	return (
		<button
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
			}}
			className={`flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-satoshi font-medium text-white duration-200 ease-in hover:bg-primary-dark
			`}
		>
			<svg
				className='fill-current'
				width='21'
				height='20'
				viewBox='0 0 21 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M1.86621 7.5C1.86621 4.3934 4.38461 1.875 7.49121 1.875H10.8245C13.9311 1.875 16.4495 4.3934 16.4495 7.5C16.4495 10.6066 13.9311 13.125 10.8245 13.125H9.15788C8.8127 13.125 8.53288 12.8452 8.53288 12.5C8.53288 12.1548 8.8127 11.875 9.15788 11.875H10.8245C13.2408 11.875 15.1995 9.91625 15.1995 7.5C15.1995 5.08375 13.2408 3.125 10.8245 3.125H7.49121C5.07497 3.125 3.11621 5.08375 3.11621 7.5C3.11621 8.62092 3.53694 9.64208 4.23008 10.4165C4.46028 10.6737 4.43839 11.0688 4.18119 11.299C3.92398 11.5292 3.52886 11.5074 3.29866 11.2502C2.40833 10.2554 1.86621 8.94026 1.86621 7.5ZM10.8245 8.125C8.4083 8.125 6.44954 10.0838 6.44954 12.5C6.44954 14.9162 8.4083 16.875 10.8245 16.875H14.1579C16.5741 16.875 18.5329 14.9162 18.5329 12.5C18.5329 11.3791 18.1122 10.3579 17.419 9.58349C17.1888 9.32628 17.2107 8.93116 17.4679 8.70096C17.7251 8.47075 18.1202 8.49264 18.3504 8.74985C19.2408 9.7446 19.7829 11.0597 19.7829 12.5C19.7829 15.6066 17.2645 18.125 14.1579 18.125H10.8245C7.71794 18.125 5.19954 15.6066 5.19954 12.5C5.19954 9.3934 7.71794 6.875 10.8245 6.875H12.4912C12.8364 6.875 13.1162 7.15482 13.1162 7.5C13.1162 7.84518 12.8364 8.125 12.4912 8.125H10.8245Z'
				/>
			</svg>
			{copied ? "Copied!" : label}
		</button>
	);
};

export default CopyToClipboard;
