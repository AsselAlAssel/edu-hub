import { useState } from "react";
import FormButton from "../Common/Dashboard/FormButton";
import InputGroup from "../Common/Dashboard/InputGroup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import validateEmail from "@/libs/validateEmail";
import Loader from "../Common/Loader";

export default function SigninWithMagicLink() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (!email) {
			return toast.error("Please enter your email address.");
		}

		if (!validateEmail(email)) {
			setLoading(false);
			return toast.error("Please enter a valid email address.");
		} else {
			signIn("email", {
				redirect: false,
				email,
			})
				.then((callback) => {
					if (callback?.ok) {
						toast.success("Email sent");
						setEmail("");
						setLoading(false);
					}
				})
				.catch((error) => {
					toast.error(error);
					setLoading(false);
				});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='mb-5 space-y-4'>
				<InputGroup
					label='Email'
					placeholder='Enter your email'
					type='email'
					name='email'
					required
					height='50px'
					value={email}
					handleChange={handleChange}
				/>

				<FormButton height='50px'>
					{loading ? (
						<>
							Sending <Loader style='border-white dark:border-dark' />
						</>
					) : (
						"Send magic link"
					)}
				</FormButton>
			</div>
		</form>
	);
}
