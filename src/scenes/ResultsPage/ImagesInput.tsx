"use client";
import { ALLOWED_IMAGE_EXTENSIONS, validateUpload } from "@/libs/uploadRules";
import { uploadToStorage } from "@/services/upload.service";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
	Box,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import Image from "next/image";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

/**
 * A story's images: thumbnails with remove buttons, and a drop zone that is
 * itself the picker (click, Enter or drop; several images at once).
 */
export default function ImagesInput({
	value,
	onChange,
	max,
	error,
}: {
	value: string[];
	onChange: (urls: string[]) => void;
	max: number;
	error?: string;
}) {
	const [uploading, setUploading] = useState(0);
	// Latest list, read when uploads finish (one may be removed meanwhile).
	const latest = useRef(value);
	latest.current = value;
	const room = max - value.length;

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: true,
		accept: { "image/*": ALLOWED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`) },
		disabled: uploading > 0 || room <= 0,
		onDropRejected: () => toast.error("يُسمح بملفات الصور فقط"),
		onDrop: async (dropped) => {
			let files = dropped;
			if (files.length > room) {
				toast.error(`يمكن إضافة ${room} صور فقط، تم أخذ أول ${room}`);
				files = files.slice(0, room);
			}
			files = files.filter((file) => {
				const invalid = validateUpload(file, "image");
				if (invalid) toast.error(`${file.name}: ${invalid}`);
				return !invalid;
			});
			if (!files.length) return;
			setUploading(files.length);
			// All at once; one failed image does not drop the rest.
			const results = await Promise.allSettled(
				files.map((file) => uploadToStorage(file, "image"))
			);
			setUploading(0);
			const urls = results.flatMap((r) =>
				r.status === "fulfilled" ? [r.value] : []
			);
			const failed = results.length - urls.length;
			if (failed) toast.error(`تعذّر رفع ${failed} من الصور`);
			if (urls.length) onChange([...latest.current, ...urls].slice(0, max));
		},
	});

	const zoneSx = (theme: Theme) => ({
		position: "relative" as const,
		display: "grid",
		placeItems: "center",
		textAlign: "center" as const,
		p: 2,
		cursor: "pointer",
		borderRadius: `${theme.tokens.radii.md}px`,
		border: `1.5px dashed ${
			error
				? theme.palette.error.main
				: isDragActive
					? theme.palette.primary.main
					: theme.tokens.colors.borderStrong
		}`,
		backgroundColor: isDragActive
			? theme.palette.action.selected
			: theme.tokens.colors.surfaceSecondary,
		color: "text.secondary",
		transition: "border-color 200ms, background-color 200ms, color 200ms",
		"&:hover": {
			borderColor: theme.palette.primary.main,
			color: "primary.main",
		},
		"&:focus-visible": {
			outline: `2px solid ${theme.palette.primary.main}`,
			outlineOffset: 2,
		},
	});

	const busy = uploading ? (
		<Box
			role='status'
			aria-live='polite'
			sx={(theme) => ({
				position: "absolute",
				inset: 0,
				display: "grid",
				placeItems: "center",
				alignContent: "center",
				gap: 1,
				borderRadius: "inherit",
				backgroundColor: theme.palette.action.hover,
				backdropFilter: "blur(2px)",
			})}
		>
			<CircularProgress size={26} aria-hidden />
			<Typography variant='caption'>
				جارٍ رفع {uploading === 1 ? "صورة" : `${uploading} صور`}…
			</Typography>
		</Box>
	) : null;

	const zone = (compact: boolean) => (
		<Box
			{...getRootProps({
				role: "button",
				"aria-label": "إضافة صور: اضغط للاختيار أو اسحب الصور هنا",
			})}
			sx={(theme) => ({
				...zoneSx(theme),
				...(compact ? { aspectRatio: "1" } : { minHeight: 170 }),
			})}
		>
			<input {...getInputProps()} />
			<Stack alignItems='center' spacing={compact ? 0.5 : 1}>
				<AddPhotoAlternateOutlinedIcon
					aria-hidden
					sx={{ fontSize: compact ? 28 : 36 }}
				/>
				<Typography
					variant={compact ? "caption" : "body2"}
					sx={{ fontWeight: 600 }}
				>
					{compact ? "إضافة صور" : "اضغط لاختيار الصور أو اسحبها هنا"}
				</Typography>
				{compact ? null : (
					<Typography variant='caption'>
						صورة أو أكثر · PNG أو JPG أو WEBP · حتى 10 ميغابايت للصورة
					</Typography>
				)}
			</Stack>
			{busy}
		</Box>
	);

	if (!value.length) return zone(false);

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
				gap: 1.25,
			}}
		>
			{value.map((src, i) => (
				<Box
					key={src + i}
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "1",
						borderRadius: `${theme.tokens.radii.md}px`,
						overflow: "hidden",
						border: `1px solid ${theme.tokens.colors.border}`,
						backgroundColor: theme.tokens.colors.surfaceSecondary,
					})}
				>
					<Image
						src={src}
						alt={`الصورة ${i + 1}`}
						fill
						sizes='120px'
						unoptimized
						style={{ objectFit: "cover" }}
					/>
					{i === 0 ? (
						<Box
							component='span'
							sx={{
								position: "absolute",
								bottom: 6,
								insetInlineEnd: 6,
								px: 0.75,
								borderRadius: 1,
								fontSize: 11,
								fontWeight: 700,
								color: "common.white",
								backgroundColor: "rgba(0,0,0,0.6)",
							}}
						>
							الأولى
						</Box>
					) : null}
					<IconButton
						size='small'
						aria-label={`حذف الصورة ${i + 1}`}
						onClick={() => onChange(value.filter((_, j) => j !== i))}
						sx={{
							position: "absolute",
							top: 6,
							insetInlineStart: 6,
							p: 0.25,
							color: "common.white",
							backgroundColor: "rgba(0,0,0,0.6)",
							"&:hover": { backgroundColor: "error.main" },
						}}
					>
						<CloseRoundedIcon sx={{ fontSize: 18 }} />
					</IconButton>
				</Box>
			))}
			{room > 0 ? zone(true) : null}
		</Box>
	);
}
