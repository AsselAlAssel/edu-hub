"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { getYouTubeVideoID } from "@/libs/constant";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export type VideoFormValues = { name: string; url: string };

type VideoFormProps = {
	open: boolean;
	handleClose: () => void;
	title?: string;
	onSubmit: (values: VideoFormValues & { videoId: string }) => Promise<void>;
	busy: boolean;
};

const emptyValues: VideoFormValues = { name: "", url: "" };

/** Returns an Arabic error for an invalid YouTube URL, or true. */
export function validateYouTubeUrl(value: string) {
	if (!value.trim()) return "رابط الفيديو مطلوب";
	return getYouTubeVideoID(value.trim())
		? true
		: "أدخل رابط فيديو صالحاً من يوتيوب";
}

export default function VideoForm({
	open,
	handleClose,
	title = "إضافة فيديو",
	onSubmit,
	busy,
}: VideoFormProps) {
	const { control, handleSubmit, reset, watch } = useForm<VideoFormValues>({
		defaultValues: emptyValues,
		mode: "onTouched",
	});
	const previewId = getYouTubeVideoID(watch("url") ?? "");

	useEffect(() => {
		if (open) reset(emptyValues);
	}, [open, reset]);

	const submit = handleSubmit(async ({ name, url }) => {
		const videoId = getYouTubeVideoID(url.trim());
		if (!videoId) return;
		await onSubmit({ name: name.trim(), url: url.trim(), videoId });
	});

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			busy={busy}
			title={title}
			description='الصق رابط الفيديو من يوتيوب وسيُعرض داخل المنصة.'
			onSubmit={() => void submit()}
			actions={
				<>
					<SecondaryButton onClick={handleClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton type='submit' variant='contained' loading={busy}>
						إضافة الفيديو
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Controller
					name='url'
					control={control}
					rules={{ validate: validateYouTubeUrl }}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='رابط يوتيوب'
							placeholder='https://www.youtube.com/watch?v=…'
							type='url'
							inputMode='url'
							autoFocus
							required
							inputProps={{ dir: "ltr" }}
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				<Controller
					name='name'
					control={control}
					rules={{
						validate: (value) => !!value.trim() || "اسم الفيديو مطلوب",
						maxLength: { value: 200, message: "الحد الأقصى 200 حرف" },
					}}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='عنوان الفيديو'
							placeholder='مثال: قوانين نيوتن للحركة'
							required
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				{previewId ? (
					<Box
						sx={(theme) => ({
							position: "relative",
							aspectRatio: "16 / 9",
							borderRadius: `${theme.tokens.radii.md}px`,
							overflow: "hidden",
							border: `1px solid ${theme.tokens.colors.border}`,
						})}
					>
						<Image
							src={`https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`}
							alt='معاينة صورة الفيديو'
							fill
							sizes='400px'
							style={{ objectFit: "cover" }}
						/>
					</Box>
				) : null}
			</Stack>
		</AppDialog>
	);
}
