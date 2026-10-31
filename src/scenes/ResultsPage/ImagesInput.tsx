"use client";
import { FormField } from "@/components/ui/FormField";
import { SecondaryButton } from "@/components/ui/buttons";
import {
	ALLOWED_IMAGE_EXTENSIONS,
	ALLOWED_VIDEO_EXTENSIONS,
	isVideoUrl,
	validateUpload,
} from "@/libs/uploadRules";
import { uploadToStorage } from "@/services/upload.service";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
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

const isHttpUrl = (text: string) => /^https?:\/\/\S+$/i.test(text);

/**
 * A story's images and videos: thumbnails with remove buttons, a drop zone
 * that is itself the picker (click, Enter or drop; several files at once),
 * and a field for pasting a direct image/video link.
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
	const [link, setLink] = useState("");
	// Latest list, read when uploads finish (one may be removed meanwhile).
	const latest = useRef(value);
	latest.current = value;
	const room = max - value.length;

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: true,
		accept: {
			"image/*": ALLOWED_IMAGE_EXTENSIONS.map((ext) => `.${ext}`),
			"video/*": ALLOWED_VIDEO_EXTENSIONS.map((ext) => `.${ext}`),
		},
		disabled: uploading > 0 || room <= 0,
		onDropRejected: () => toast.error("يُسمح بملفات الصور والفيديو فقط"),
		onDrop: async (dropped) => {
			let files = dropped;
			if (files.length > room) {
				toast.error(`يمكن إضافة ${room} ملفات فقط، تم أخذ أول ${room}`);
				files = files.slice(0, room);
			}
			files = files.filter((file) => {
				const invalid = validateUpload(file, "media");
				if (invalid) toast.error(`${file.name}: ${invalid}`);
				return !invalid;
			});
			if (!files.length) return;
			setUploading(files.length);
			// All at once; one failed file does not drop the rest.
			const results = await Promise.allSettled(
				files.map((file) => uploadToStorage(file, "media"))
			);
			setUploading(0);
			const urls = results.flatMap((r) =>
				r.status === "fulfilled" ? [r.value] : []
			);
			const failed = results.length - urls.length;
			if (failed) toast.error(`تعذّر رفع ${failed} من الملفات`);
			if (urls.length) onChange([...latest.current, ...urls].slice(0, max));
		},
	});

	const addLink = () => {
		const url = link.trim();
		if (!isHttpUrl(url))
			return toast.error("أدخل رابطاً صحيحاً يبدأ بـ https://");
		if (room <= 0) return toast.error(`الحد الأقصى ${max} ملفات`);
		onChange([...value, url]);
		setLink("");
	};

	const linkField = (
		<Stack direction='row' spacing={1} alignItems='flex-end' sx={{ mt: 1.5 }}>
			<FormField
				value={link}
				onChange={(e) => setLink(e.target.value)}
				onKeyDown={(e) => {
					// Enter adds the link instead of submitting the dialog.
					if (e.key !== "Enter") return;
					e.preventDefault();
					addLink();
				}}
				label='أو الصق رابط صورة أو فيديو'
				placeholder='https://…/video.mp4'
				dir='ltr'
				size='small'
				disabled={room <= 0}
			/>
			<SecondaryButton
				onClick={addLink}
				disabled={room <= 0 || !link.trim()}
				sx={{ flexShrink: 0, height: 40 }}
			>
				إضافة
			</SecondaryButton>
		</Stack>
	);

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
				جارٍ رفع {uploading === 1 ? "ملف" : `${uploading} ملفات`}…
			</Typography>
		</Box>
	) : null;

	const zone = (compact: boolean) => (
		<Box
			{...getRootProps({
				role: "button",
				"aria-label":
					"إضافة صور أو فيديوهات: اضغط للاختيار أو اسحب الملفات هنا",
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
					{compact ? "إضافة" : "اضغط لاختيار الصور والفيديوهات أو اسحبها هنا"}
				</Typography>
				{compact ? null : (
					<Typography variant='caption'>
						صور (PNG أو JPG أو WEBP حتى 10 ميغابايت) · فيديو (MP4 أو WEBM أو MOV
						حتى 200 ميغابايت)
					</Typography>
				)}
			</Stack>
			{busy}
		</Box>
	);

	if (!value.length)
		return (
			<>
				{zone(false)}
				{linkField}
			</>
		);

	return (
		<>
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
						{isVideoUrl(src) ? (
							<>
								{/* #t: Safari shows the first frame instead of black. */}
								<video
									src={`${src}#t=0.1`}
									preload='metadata'
									muted
									playsInline
									aria-label={`الفيديو ${i + 1}`}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
								<PlayArrowRoundedIcon
									aria-hidden
									sx={{
										position: "absolute",
										inset: 0,
										m: "auto",
										fontSize: 36,
										color: "common.white",
										filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.6))",
									}}
								/>
							</>
						) : (
							<Image
								src={src}
								alt={`الصورة ${i + 1}`}
								fill
								sizes='120px'
								unoptimized
								style={{ objectFit: "cover" }}
							/>
						)}
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
							aria-label={`حذف ${isVideoUrl(src) ? "الفيديو" : "الصورة"} ${i + 1}`}
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
			{linkField}
		</>
	);
}
