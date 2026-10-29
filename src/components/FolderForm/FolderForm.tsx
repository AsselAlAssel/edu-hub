"use client";
import AppDialog from "@/components/ui/AppDialog";
import { SecondaryButton } from "@/components/ui/buttons";
import { FormField } from "@/components/ui/FormField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Values = { name: string; price: string };
const empty: Values = { name: "", price: "" };

/** "" → null (free folder); otherwise a whole number of ILS, or an error. */
export function parseUnitPrice(value: string): number | null | "invalid" {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const price = Number(trimmed);
	return Number.isInteger(price) && price >= 1 && price <= 100000
		? price
		: "invalid";
}

/**
 * New folder dialog. On the class page (`withPrice`) the folder is a unit:
 * an optional price makes it a paid unit right away.
 */
export default function FolderForm({
	open,
	handleClose,
	onSubmit,
	busy,
	withPrice = false,
}: {
	open: boolean;
	handleClose: () => void;
	onSubmit: (name: string, price: number | null) => Promise<void>;
	busy: boolean;
	withPrice?: boolean;
}) {
	const { control, handleSubmit, reset } = useForm<Values>({
		defaultValues: empty,
	});
	useEffect(() => {
		if (open) reset(empty);
	}, [open, reset]);

	const submit = handleSubmit(async ({ name, price }) => {
		const parsed = withPrice ? parseUnitPrice(price) : null;
		if (parsed === "invalid") return;
		await onSubmit(name.trim(), parsed);
	});

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			busy={busy}
			title={withPrice ? "وحدة جديدة" : "مجلد جديد"}
			onSubmit={() => void submit()}
			actions={
				<>
					<SecondaryButton onClick={handleClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton type='submit' variant='contained' loading={busy}>
						إنشاء المجلد
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Controller
					name='name'
					control={control}
					rules={{
						validate: (value) => !!value.trim() || "اسم المجلد مطلوب",
						maxLength: { value: 120, message: "الحد الأقصى 120 حرفاً" },
					}}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='اسم المجلد'
							placeholder='مثال: الوحدة الأولى — الحركة'
							autoFocus
							required
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				{withPrice ? (
					<Controller
						name='price'
						control={control}
						rules={{
							validate: (value) =>
								parseUnitPrice(value) !== "invalid" ||
								"أدخل رقماً صحيحاً بين 1 و 100000",
						}}
						render={({ field, fieldState: { error } }) => (
							<FormField
								{...field}
								label='سعر الوحدة (₪) — اختياري'
								type='number'
								inputMode='numeric'
								inputProps={{ min: 1, max: 100000, step: 1, dir: "ltr" }}
								error={!!error}
								helperText={
									error?.message ??
									"فارغ = مجلد مجاني. مع السعر تصبح فيديوهات Bunny والملفات داخله للمشتركين فقط."
								}
							/>
						)}
					/>
				) : null}
			</Stack>
		</AppDialog>
	);
}
