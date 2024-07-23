"use client";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (
		<>
			<div className='mx-auto w-full max-w-[400px] px-4 py-10'>
				<div className='space-y-2 pb-3.5' />
				<div>
					<SigninWithPassword />
				</div>
			</div>
		</>
	);
}
