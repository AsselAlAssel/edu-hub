"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { ALLOWED_FILE_EXTENSIONS, validateUpload } from "@/libs/uploadRules";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

type AttachmentsFormProps = {
	open: boolean;
	handleClose: () => void;
	title?: string;
	onSubmit: (file: File, displayName: string) => Promise<void>;
	busy: boolean;
};

const formatSize = (bytes: number) =>
	bytes >= 1024 * 1024
		? `${(bytes / 1024 / 1024).toFixed(1)} ميغابايت`
		: `${Math.max(1, Math.round(bytes / 1024))} كيلوبايت`;

/** Single-file upload dialog with type/size validation before any request. */
export default function AttachmentsForm({
	open,
	handleClose,
	title = "رفع ملف",
	onSubmit,
	busy,
}: AttachmentsFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const [displayName, setDisplayName] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setFile(null);
			setDisplayName("");
			setError(null);
		}
	}, [open]);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		open: openPicker,
	} = useDropzone({
		multiple: false,
		noClick: true,
		disabled: busy,
		onDrop: ([picked]) => {
			if (!picked) return;
			const invalid = validateUpload(picked);
			setError(invalid);
			setFile(invalid ? null : picked);
			if (!invalid) setDisplayName(picked.name);
		},
	});

	const submit = async () => {
		if (!file) {
			setError("اختر ملفاً لرفعه");
			return;
		}
		if (!displayName.trim()) {
			setError("اسم الملف مطلوب");
			return;
		}
		await onSubmit(file, displayName.trim());
	};

	return (
		<AppDialog
			open={open}
			onClose={handleClose}
			busy={busy}
			title={title}
			onSubmit={() => void submit()}
			actions={
				<>
					<SecondaryButton onClick={handleClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={busy}
						loadingPosition='start'
						startIcon={<CloudUploadOutlinedIcon />}
					>
						{busy ? "جارٍ الرفع…" : "رفع الملف"}
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<Box
					{...getRootProps({
						role: "group",
						"aria-label": "منطقة إسقاط الملف",
					})}
					sx={(theme) => ({
						p: 3,
						textAlign: "center",
						borderRadius: `${theme.tokens.radii.lg}px`,
						border: `1.5px dashed ${isDragActive ? theme.tokens.colors.cyan : theme.tokens.colors.borderStrong}`,
						backgroundColor: isDragActive
							? alpha(theme.tokens.colors.cyan, 0.1)
							: theme.tokens.colors.surfaceSecondary,
						boxShadow: isDragActive
							? `inset 0 0 40px ${alpha(theme.tokens.colors.cyan, 0.15)}`
							: "none",
						transform: isDragActive ? "scale(1.015)" : "none",
						transition: theme.transitions.create([
							"transform",
							"background-color",
							"border-color",
							"box-shadow",
						]),
						"& .qa-upload-icon": {
							animation: isDragActive ? "qaBounce 700ms ease infinite" : "none",
						},
						"@keyframes qaBounce": {
							"0%, 100%": { transform: "translateY(0)" },
							"50%": { transform: "translateY(-6px)" },
						},
					})}
				>
					<input {...getInputProps({ "aria-label": "اختيار ملف" })} />
					{file ? (
						<Stack
							direction='row'
							alignItems='center'
							gap={1.5}
							sx={{ textAlign: "start" }}
						>
							<InsertDriveFileOutlinedIcon color='primary' aria-hidden />
							<Box sx={{ minWidth: 0, flex: 1 }}>
								<Typography sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
									{file.name}
								</Typography>
								<Typography variant='caption' sx={{ color: "text.secondary" }}>
									{formatSize(file.size)}
								</Typography>
							</Box>
							<Button
								size='small'
								variant='text'
								onClick={openPicker}
								disabled={busy}
							>
								تغيير
							</Button>
						</Stack>
					) : (
						<Stack alignItems='center' spacing={1}>
							<CloudUploadOutlinedIcon
								className='qa-upload-icon'
								sx={{ color: "primary.main", fontSize: 40 }}
								aria-hidden
							/>
							<Typography sx={{ fontWeight: 600 }}>
								{isDragActive ? "أفلِت الملف للرفع" : "اسحب الملف إلى هنا"}
							</Typography>
							<Button size='small' variant='outlined' onClick={openPicker}>
								أو اختر من جهازك
							</Button>
							<Typography
								variant='caption'
								sx={{ color: "text.secondary" }}
								dir='auto'
							>
								الأنواع المسموحة: {ALLOWED_FILE_EXTENSIONS.join("، ")} — حتى 200
								ميغابايت
							</Typography>
						</Stack>
					)}
				</Box>
				{file ? (
					<FormField
						label='الاسم الظاهر للطلاب'
						value={displayName}
						onChange={(event) => setDisplayName(event.target.value)}
						required
						inputProps={{ maxLength: 255 }}
					/>
				) : null}
				{/* Indeterminate: the upload is a single request with no byte progress. */}
				{busy ? (
					<Stack spacing={1} role='status' aria-live='polite'>
						<LinearProgress aria-label='جارٍ رفع الملف' />
						<Typography variant='caption' sx={{ color: "text.secondary" }}>
							جارٍ رفع الملف، لا تغلق النافذة…
						</Typography>
					</Stack>
				) : null}
				{error ? (
					<Typography
						role='alert'
						variant='body2'
						sx={{
							color: "error.main",
							fontWeight: 600,
							animation: "qaErrorIn 320ms cubic-bezier(0.22, 1, 0.36, 1) both",
							"@keyframes qaErrorIn": {
								from: { opacity: 0, transform: "translateY(-4px)" },
								to: { opacity: 1, transform: "none" },
							},
						}}
					>
						{error}
					</Typography>
				) : null}
			</Stack>
		</AppDialog>
	);
}
