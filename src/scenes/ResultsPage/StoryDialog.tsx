"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { SecondaryButton } from "@/components/ui/buttons";
import { getYouTubeVideoID } from "@/libs/constant";
import { getErrorMessage } from "@/libs/errors";
import type { Story } from "@/libs/story";
import {
	createStoryRequest,
	updateStoryRequest,
	type StoryInput,
} from "@/services/story.service";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	FormHelperText,
	InputLabel,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import ImagesInput from "./ImagesInput";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { mutate } from "swr";

const MAX_IMAGES = 10;
type MediaKind = "images" | "video";

const toValues = (story?: Story): StoryInput => ({
	title: story?.title ?? "",
	description: story?.description ?? "",
	images: story?.images ?? [],
	youtubeUrl: story?.youtubeUrl ?? "",
});

/** Add or edit a story: title, description, then images or a YouTube link. */
export default function StoryDialog({
	open,
	onClose,
	story,
}: {
	open: boolean;
	onClose: () => void;
	/** Present when editing. */
	story?: Story;
}) {
	const isEdit = !!story;
	const [kind, setKind] = useState<MediaKind>("images");
	const [busy, setBusy] = useState(false);
	const mediaLabelId = useId();
	const { control, handleSubmit, reset } = useForm<StoryInput>({
		defaultValues: toValues(story),
	});

	useEffect(() => {
		if (!open) return;
		reset(toValues(story));
		setKind(story?.youtubeUrl ? "video" : "images");
	}, [open, story, reset]);

	const onSubmit = handleSubmit(async (data) => {
		// Only the chosen kind of media is sent.
		const body =
			kind === "video" ? { ...data, images: [] } : { ...data, youtubeUrl: "" };
		setBusy(true);
		try {
			if (story) await updateStoryRequest({ id: story.id, ...body });
			else await createStoryRequest(body);
			await mutate("/api/story");
			toast.success(isEdit ? "تم تحديث القصة" : "تمت إضافة القصة");
			onClose();
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر حفظ القصة"));
		} finally {
			setBusy(false);
		}
	});

	return (
		<AppDialog
			open={open}
			onClose={onClose}
			busy={busy}
			title={isEdit ? "تعديل القصة" : "إضافة قصة"}
			onSubmit={() => void onSubmit()}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton type='submit' variant='contained' loading={busy}>
						{isEdit ? "حفظ التغييرات" : "إضافة القصة"}
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Controller
					name='title'
					control={control}
					rules={{
						validate: (value) => !!value.trim() || "العنوان مطلوب",
						maxLength: { value: 150, message: "الحد الأقصى 150 حرفاً" },
					}}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='العنوان'
							placeholder='مثال: أحمد – معدل 98.5'
							autoFocus
							required
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
				<Controller
					name='description'
					control={control}
					rules={{
						maxLength: { value: 3000, message: "الحد الأقصى 3000 حرف" },
					}}
					render={({ field, fieldState: { error } }) => (
						<FormField
							{...field}
							label='الوصف (اختياري)'
							multiline
							minRows={3}
							placeholder='احكِ قصة الطالب باختصار…'
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>

				<Box>
					<InputLabel id={mediaLabelId} sx={{ mb: 1 }}>
						الصور أو الفيديو
					</InputLabel>
					<ToggleButtonGroup
						exclusive
						fullWidth
						color='primary'
						value={kind}
						onChange={(_, value: MediaKind | null) => value && setKind(value)}
						aria-labelledby={mediaLabelId}
						sx={{
							"& .MuiToggleButton-root": { gap: 1, py: 1.1, fontWeight: 600 },
						}}
					>
						<ToggleButton value='images'>
							<PhotoLibraryOutlinedIcon fontSize='small' />
							صور
						</ToggleButton>
						<ToggleButton value='video'>
							<YouTubeIcon fontSize='small' />
							فيديو YouTube
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>

				{kind === "video" ? (
					<Controller
						name='youtubeUrl'
						control={control}
						rules={{
							validate: (value) =>
								!!getYouTubeVideoID(value.trim()) || "أدخل رابط YouTube صحيحاً",
						}}
						render={({ field, fieldState: { error } }) => {
							const id = getYouTubeVideoID(field.value.trim());
							return (
								<Stack spacing={1.5}>
									<FormField
										{...field}
										label='رابط الفيديو'
										placeholder='https://www.youtube.com/watch?v=…'
										dir='ltr'
										required
										error={!!error}
										helperText={error?.message}
									/>
									{id ? (
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
												src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
												alt='معاينة الفيديو'
												fill
												sizes='480px'
												unoptimized
												style={{ objectFit: "cover" }}
											/>
										</Box>
									) : null}
								</Stack>
							);
						}}
					/>
				) : (
					<Controller
						name='images'
						control={control}
						rules={{
							// Only mounted (and checked) while "صور" is chosen.
							validate: (value) =>
								value.length > 0 || "أضف صورة واحدة على الأقل",
						}}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<Box>
								<ImagesInput
									value={value}
									onChange={onChange}
									max={MAX_IMAGES}
									error={error?.message}
								/>
								<FormHelperText error={!!error}>
									{error?.message ??
										`${value.length} من ${MAX_IMAGES} صور · الصورة الأولى تظهر أولاً`}
								</FormHelperText>
							</Box>
						)}
					/>
				)}
			</Stack>
		</AppDialog>
	);
}
