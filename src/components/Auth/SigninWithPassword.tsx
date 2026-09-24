"use client";
import { FormField, PasswordField } from "@/components/ui/FormField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Stack } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type SigninValues = { email: string; password: string };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only same-origin relative paths are allowed as post-login destinations. */
export function safeCallbackUrl(value: string | null) {
	return value && value.startsWith("/") && !value.startsWith("//")
		? value
		: "/classes";
}

export default function SigninWithPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formError, setFormError] = useState<string | null>(null);
	const { control, handleSubmit, formState } = useForm<SigninValues>({
		defaultValues: { email: "", password: "" },
		mode: "onTouched",
	});

	useEffect(() => {
		if (searchParams.get("signOut"))
			void signOut({ callbackUrl: "/auth/signin" });
	}, [searchParams]);

	const onSubmit = handleSubmit(async ({ email, password }) => {
		setFormError(null);
		const result = await signIn("credentials", {
			email: email.trim().toLowerCase(),
			password,
			redirect: false,
		});

		if (!result || result.error) {
			setFormError(
				result?.error && result.error !== "CredentialsSignin"
					? result.error
					: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
			);
			return;
		}

		toast.success("تم تسجيل الدخول بنجاح");
		router.push(safeCallbackUrl(searchParams.get("callbackUrl")));
		router.refresh();
	});

	return (
		<Stack
			component='form'
			noValidate
			onSubmit={onSubmit}
			spacing={2.5}
			aria-label='نموذج تسجيل الدخول'
		>
			{formError ? (
				<Alert severity='error' role='alert'>
					{formError}
				</Alert>
			) : null}
			<Controller
				name='email'
				control={control}
				rules={{
					required: "البريد الإلكتروني مطلوب",
					pattern: {
						value: EMAIL_PATTERN,
						message: "أدخل بريداً إلكترونياً صالحاً",
					},
				}}
				render={({ field, fieldState: { error } }) => (
					<FormField
						{...field}
						label='البريد الإلكتروني'
						type='email'
						autoComplete='email'
						inputMode='email'
						placeholder='name@example.com'
						required
						autoFocus
						inputProps={{ dir: "ltr" }}
						error={!!error}
						helperText={error?.message}
					/>
				)}
			/>
			<Controller
				name='password'
				control={control}
				rules={{ required: "كلمة المرور مطلوبة" }}
				render={({ field, fieldState: { error } }) => (
					<PasswordField
						{...field}
						label='كلمة المرور'
						autoComplete='current-password'
						required
						inputProps={{ dir: "ltr" }}
						error={!!error}
						helperText={error?.message}
					/>
				)}
			/>
			<LoadingButton
				type='submit'
				variant='contained'
				size='large'
				fullWidth
				loading={formState.isSubmitting}
			>
				تسجيل الدخول
			</LoadingButton>
		</Stack>
	);
}
