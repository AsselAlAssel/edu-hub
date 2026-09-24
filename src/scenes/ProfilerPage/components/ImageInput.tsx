"use client";
import { ALLOWED_IMAGE_EXTENSIONS, validateUpload } from "@/libs/uploadRules";
import { uploadToStorage } from "@/services/upload.service";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import {
	Box,
	Button,
	CircularProgress,
	InputLabel,
	Stack,
	Typography,
} from "@mui/material";
import Image from "next/image";
import { useId, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

type ImageInputProps = {
	onChangeImage: (url: string | null) => void;
	imageSrc: string | null;
	inputLabel?: string;
};

/** Image picker with drag-and-drop, preview, replace and remove. */
export default function ImageInput({
	onChangeImage,
	imageSrc,
	inputLabel = "الصورة",
}: ImageInputProps) {
	const labelId = useId();
	const [loading, setLoading] = useState(false);

	const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
		noClick: true,
		multiple: false,
		accept: { "image/*": ALLOWED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`) },
		disabled: loading,
		onDropRejected: () => toast.error("يُسمح بملفات الصور فقط"),
		onDrop: async ([file]) => {
			if (!file) return;
			const invalid = validateUpload(file, "image");
			if (invalid) {
				toast.error(invalid);
				return;
			}
			setLoading(true);
			try {
				onChangeImage(await uploadToStorage(file, "image"));
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "فشل رفع الصورة");
			} finally {
				setLoading(false);
			}
		},
	});

	return (
		<Box>
			<InputLabel id={labelId}>{inputLabel}</InputLabel>
			<Box
				{...getRootProps({ role: "group", "aria-labelledby": labelId })}
				sx={(theme) => ({
					position: "relative",
					display: "grid",
					placeItems: "center",
					minHeight: 180,
					p: 2,
					borderRadius: `${theme.tokens.radii.md}px`,
					border: `1px dashed ${isDragActive ? theme.palette.primary.main : theme.tokens.colors.borderStrong}`,
					backgroundColor: isDragActive
						? theme.palette.action.selected
						: theme.tokens.colors.surfaceSecondary,
					overflow: "hidden",
				})}
			>
				<input {...getInputProps({ "aria-label": inputLabel })} />
				{imageSrc ? (
					<Box
						sx={{
							position: "relative",
							width: "100%",
							aspectRatio: "16 / 9",
							maxHeight: 220,
						}}
					>
						<Image
							src={imageSrc}
							alt={`معاينة ${inputLabel}`}
							fill
							sizes='480px'
							style={{ objectFit: "contain" }}
						/>
					</Box>
				) : (
					<Stack
						alignItems='center'
						spacing={1}
						sx={{ color: "text.secondary", textAlign: "center" }}
					>
						<AddPhotoAlternateOutlinedIcon aria-hidden />
						<Typography variant='body2'>
							اسحب صورة إلى هنا، أو اختر ملفاً من جهازك
						</Typography>
						<Typography variant='caption'>
							PNG أو JPG أو WEBP — حتى 10 ميغابايت
						</Typography>
					</Stack>
				)}
				{loading ? (
					<Box
						role='status'
						aria-live='polite'
						sx={(theme) => ({
							position: "absolute",
							inset: 0,
							display: "grid",
							placeItems: "center",
							backgroundColor: theme.palette.action.hover,
							backdropFilter: "blur(2px)",
						})}
					>
						<CircularProgress size={28} aria-label='جارٍ رفع الصورة' />
					</Box>
				) : null}
			</Box>
			<Stack direction='row' gap={1} sx={{ mt: 1.5 }}>
				<Button
					size='small'
					variant='outlined'
					onClick={open}
					disabled={loading}
				>
					{imageSrc ? "تغيير الصورة" : "اختيار صورة"}
				</Button>
				{imageSrc ? (
					<Button
						size='small'
						variant='text'
						color='error'
						onClick={() => onChangeImage(null)}
						disabled={loading}
					>
						إزالة الصورة
					</Button>
				) : null}
			</Stack>
		</Box>
	);
}
