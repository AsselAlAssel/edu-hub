"use client";
import Link from "next/link";
import { useState } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import GithubSigninButton from "../GithubSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import SigninWithPassword from "../SigninWithPassword";
import DemoSignin from "./DemoSignin";

export default function Signin() {
	const [signinOption, setSigninOption] = useState("magic-link");

	return (
		<>
			<div className='mx-auto w-full max-w-[400px] px-4 py-10'>
				<div className='space-y-3 pb-7.5'>
					<GoogleSigninButton text='Sign in' />

					<GithubSigninButton text='Sign in' />
				</div>
				<div className='mb-7.5 flex items-center justify-center'>
					<span className='block h-px w-full bg-stroke dark:bg-stroke-dark'></span>
					<div className='inline-block bg-white px-3 text-base text-body dark:bg-[#151F34] dark:text-gray-5'>
						OR
					</div>
					<span className='block h-px w-full bg-stroke dark:bg-stroke-dark'></span>
				</div>

				<div className='mb-4.5 flex w-full items-center justify-between gap-1.5 rounded-10 border border-stroke p-1 dark:border-stroke-dark'>
					<button
						onClick={() => setSigninOption("magic-link")}
						className={`h-[38px] w-full rounded-lg font-satoshi text-base font-medium tracking-[-.2px] ${
							signinOption === "magic-link"
								? "bg-primary/[.08] text-primary"
								: "text-dark dark:text-white"
						}`}
					>
						Magic Link
					</button>
					<button
						onClick={() => setSigninOption("password")}
						className={`h-[38px] w-full rounded-lg font-satoshi text-base font-medium tracking-[-.2px] ${
							signinOption === "password"
								? "bg-primary/[.08] text-primary"
								: "text-dark dark:text-white"
						}`}
					>
						Password
					</button>
				</div>

				<div>
					{signinOption === "magic-link" ? (
						<SigninWithMagicLink />
					) : (
						<SigninWithPassword />
					)}
				</div>

				<p className='text-center font-satoshi text-base font-medium text-dark dark:text-white'>
					Don&#39;t have an account yet?{" "}
					<Link href='/auth/signup' className='ml-1 inline-block text-primary'>
						Create account →
					</Link>
				</p>

				<span className='my-10 block h-px w-full bg-stroke dark:bg-stroke-dark '></span>

				<DemoSignin />
			</div>
		</>
	);
}
