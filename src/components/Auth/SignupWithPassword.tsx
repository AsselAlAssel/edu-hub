import React, { useState } from "react";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../Common/Loader";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignupWithPassword = () => {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const [loading, setLoading] = useState(false);
	const { name, email, password } = data;

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!name.trim() || !email || !password) {
			return toast.error("Please fill in all fields!");
		}

		setLoading(true);

		try {
			const res = await axios.post("/api/user/register", {
				name,
				email,
				password,
			});

			if (res.status === 200) {
				toast.success("User has been registered");
				setData({
					name: "",
					email: "",
					password: "",
				});
				setLoading(false);
				signIn("credentials", { ...data, redirect: false }).then((callback) => {
					if (callback?.error) {
						toast.error(callback.error);
						setLoading(false);
					}

					if (callback?.ok && !callback?.error) {
						setLoading(false);
						router.push("/admin");
					}
				});
			} else {
				toast.error(res.data);
				setLoading(false);
			}
		} catch (error: any) {
			toast.error(error.response.data);
			setLoading(false);
			return;
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='mb-5 space-y-4'>
				<InputGroup
					label='Name'
					placeholder='Enter your username'
					maxlength='10'
					type='text'
					name='name'
					required
					height='50px'
					handleChange={handleChange}
					value={name}
				/>

				<InputGroup
					label='Email'
					placeholder='Enter your email'
					type='email'
					name='email'
					required
					height='50px'
					handleChange={handleChange}
					value={email}
				/>

				<InputGroup
					label='Password'
					placeholder='Enter your password'
					type='password'
					name='password'
					required
					height='50px'
					handleChange={handleChange}
					value={password}
				/>

				<FormButton height='50px'>
					Sign Up {loading && <Loader style='border-white dark:border-dark' />}
				</FormButton>
			</div>
		</form>
	);
};

export default SignupWithPassword;
