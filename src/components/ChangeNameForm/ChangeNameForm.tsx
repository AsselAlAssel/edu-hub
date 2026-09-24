"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ChangeNameFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	/** Initial value (rename). Empty for create. */
	name?: string;
	onSubmit: (name: string) => Promise<void>;
	isUpdatingName: boolean;
	label?: string;
	placeholder?: string;
	submitLabel?: string;
	maxLength?: number;
};

/** Single-field name dialog used for creating folders and renaming any resource. */
export default function ChangeNameForm({
	open,
	handleClose,
	title,
	name = "",
	onSubmit,
	isUpdatingName,
	label = "الاسم",
	placeholder,
	submitLabel = "حفظ",
	maxLength = 120,
}: ChangeNameFormProps) {
	const { control, handleSubmit, reset } = useForm<{ name: string }>({
		defaultValues: { name },
	});

	useEffect(() => {
		if (open) reset({ name });
	}, [open, name, reset]);

	const submit = handleSubmit(async (data) => {
		await onSubmit(data.name.trim());
	});

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			busy={isUpdatingName}
			title={title}
			onSubmit={() => void submit()}
			actions={
				<>
					<SecondaryButton onClick={handleClose} disabled={isUpdatingName}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={isUpdatingName}
					>
						{submitLabel}
					</LoadingButton>
				</>
			}
		>
			<Controller
				name='name'
				control={control}
				rules={{
					validate: (value) => !!value.trim() || `${label} مطلوب`,
					maxLength: {
						value: maxLength,
						message: `الحد الأقصى ${maxLength} حرفاً`,
					},
				}}
				render={({ field, fieldState: { error } }) => (
					<FormField
						{...field}
						label={label}
						placeholder={placeholder}
						autoFocus
						required
						error={!!error}
						helperText={error?.message}
					/>
				)}
			/>
		</AppDialog>
	);
}
