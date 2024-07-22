"use client";
import Link from "next/link";
import { useState } from "react";
import GithubSigninButton from "../GithubSigninButton";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	const [signinOption, setSigninOption] = useState("magic-link");

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
