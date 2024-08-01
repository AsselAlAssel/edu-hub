"use client";
import { signIn, signOut } from "next-auth/react";
import { useQueryState } from "next-usequerystate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormButton from "../Common/Dashboard/FormButton";
import InputGroup from "../Common/Dashboard/InputGroup";
import Loader from "../Common/Loader";

export default function SigninWithPassword() {
	const [signOutQuery] = useQueryState("signOut");
	const [data, setData] = useState({
		email: "",
		password: "",
		remember: false,
	});

	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!data.email) {
			return toast.error("Please enter your email address.");
		}

		setLoading(true);

		signIn("credentials", { ...data, redirect: false }).then((callback) => {
			if (callback?.error) {
				toast.error(callback.error);
				setLoading(false);
			}
			console.log("callback", callback);

			if (callback?.ok && !callback?.error) {
				toast.success("Logged in successfully");
				setLoading(false);
				setData({ email: "", password: "", remember: false });
				router.push("/classes");
			}
		});
	};

	useEffect(() => {
		if (signOutQuery) {
			signOut({ callbackUrl: "/auth/signin" });
		}
	}, [signOutQuery]);

	return (
		<form className='mb-5' onSubmit={handleSubmit}>
			<InputGroup
				label='البريد الإلكتروني'
				placeholder='أدخل بريدك الإلكتروني'
				type='email'
				name='email'
				required
				height='50px'
				handleChange={handleChange}
				value={data.email}
			/>

			<InputGroup
				label='كلمة المرور'
				placeholder='أدخل كلمة المرور'
				type='password'
				name='password'
				required
				height='50px'
				handleChange={handleChange}
				value={data.password}
			/>
			<br />

			<FormButton height='50px'>
				تسجيل الدخول
				{loading && <Loader style='dark:border-primary border-white' />}
			</FormButton>
		</form>
	);
}
