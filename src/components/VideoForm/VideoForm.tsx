"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { parseBunnyUrl } from "@/libs/bunnyUrl";
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

/** YouTube (free) or Bunny Stream (paid-unit) id, or null. */
const videoIdOf = (url: string) =>
	getYouTubeVideoID(url) ?? parseBunnyUrl(url)?.videoId ?? null;

/** Returns an Arabic error for an invalid video URL, or true. */
export function validateYouTubeUrl(value: string) {
	if (!value.trim()) return "رابط الفيديو مطلوب";
	return videoIdOf(value.trim())
		? true
		: "أدخل رابط فيديو صالحاً من يوتيوب أو Bunny";
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
		// Errors only after a submit attempt, then live while fixing them.
		mode: "onSubmit",
		reValidateMode: "onChange",
	});
	const url = (watch("url") ?? "").trim();
	const previewId = getYouTubeVideoID(url);
	const linkHint = previewId
		? "فيديو يوتيوب: متاح للجميع."
		: parseBunnyUrl(url)
			? "فيديو Bunny: داخل وحدة مدفوعة يظهر للمشتركين فقط."
			: " ";

	useEffect(() => {
		if (open) reset(emptyValues);
	}, [open, reset]);

	const submit = handleSubmit(async ({ name, url }) => {
		const videoId = videoIdOf(url.trim());
		if (!videoId) return;
		await onSubmit({ name: name.trim(), url: url.trim(), videoId });
	});

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			busy={busy}
			title={title}
			description='الصق رابط الفيديو من يوتيوب أو من Bunny.'
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
							label='رابط يوتيوب أو Bunny'
							placeholder='https://www.youtube.com/watch?v=…'
							type='url'
							inputMode='url'
							autoFocus
							required
							inputProps={{ dir: "ltr" }}
							error={!!error}
							helperText={error?.message ?? linkHint}
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
