"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { useCreateClass, useUpdateClass } from "@/hooks/useClassApi";
import { getErrorMessage } from "@/libs/errors";
import ImageInput from "@/scenes/ProfilerPage/components/ImageInput";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";
import { Stack } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { mutate } from "swr";

type ClassFormValues = {
	name: string;
	description?: string;
	image?: string;
};

interface ClassDialogProps {
	handleCloseDialog: () => void;
	open: boolean;
	/** Present when editing. */
	selectedClass?: ClassFormValues;
	classId?: string;
}

const emptyValues: ClassFormValues = { name: "", description: "", image: "" };

export default function ClassDialog({
	open,
	handleCloseDialog,
	selectedClass,
	classId,
}: ClassDialogProps) {
	const isEdit = !!classId;
	const { control, handleSubmit, reset, setValue, watch } =
		useForm<ClassFormValues>({
			defaultValues: selectedClass ?? emptyValues,
		});
	const { isMutating, trigger: createClass } = useCreateClass();
	const { isUpdating, updateClass } = useUpdateClass();
	const busy = isMutating || isUpdating;

	useEffect(() => {
		if (open) reset(selectedClass ?? emptyValues);
	}, [open, selectedClass, reset]);

	const onSubmit = handleSubmit(async (data) => {
		try {
			if (classId) await updateClass({ id: classId, ...data });
			else await createClass(data);
			await mutate("/api/class");
			toast.success(isEdit ? "تم تحديث الصف" : "تم إنشاء الصف");
			handleCloseDialog();
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر حفظ الصف"));
		}
	});

	return (
		<AppDialog
			open={open}
			onClose={handleCloseDialog}
			busy={busy}
			title={isEdit ? "تعديل الصف" : "إنشاء صف جديد"}
			onSubmit={() => void onSubmit()}
			actions={
				<>
					<SecondaryButton onClick={handleCloseDialog} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton type='submit' variant='contained' loading={busy}>
						{isEdit ? "حفظ التغييرات" : "إنشاء الصف"}
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Controller
					name='name'
					control={control}
					rules={{
						validate: (value) => !!value.trim() || "اسم الصف مطلوب",
						maxLength: { value: 50, message: "الحد الأقصى 50 حرفاً" },
					}}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='اسم الصف'
							placeholder='مثال: الصف العاشر'
							autoFocus
							required
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				<ImageInput
					inputLabel='صورة الصف (اختياري)'
					imageSrc={watch("image") || null}
					onChangeImage={(url) => setValue("image", url ?? "")}
				/>
			</Stack>
		</AppDialog>
	);
}
