"use client";
import Card from "@/components/Common/Dashboard/Card";
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import { createApiKey } from "@/actions/api-key";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function CreateToken() {
	const ref = useRef<HTMLFormElement>(null);

	return (
		<div className='lg:w-2/6'>
			<Card>
				<div className='mb-6'>
					<h3 className='mb-2.5 font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
						Want to use the API?
					</h3>
					<p className='text-body'>Create a new token to get the access.</p>
				</div>

				<form
					ref={ref}
					action={async (formData) => {
						try {
							await createApiKey(formData.get("token") as string);
							toast.success("Token created successfully");
						} catch (error) {
							toast.error("Unable to create token");
						}

						ref.current?.reset();
					}}
					className='space-y-5.5'
				>
					<InputGroup
						label='Token name'
						name='token'
						placeholder='Enter a token name'
						type='text'
						required={true}
					/>

					<FormButton>Create Token</FormButton>
				</form>
			</Card>
		</div>
	);
}
