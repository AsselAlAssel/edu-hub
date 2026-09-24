"use client";
import AppDialog from "@/components/ui/AppDialog";
import { FormField } from "@/components/ui/FormField";
import { ALLOWED_FILE_EXTENSIONS, validateUpload } from "@/libs/uploadRules";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Stack, Typography } from "@mui/material";
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
						borderRadius: `${theme.tokens.radii.md}px`,
						border: `1.5px dashed ${isDragActive ? theme.palette.primary.main : theme.tokens.colors.borderStrong}`,
						backgroundColor: isDragActive
							? theme.palette.action.selected
							: theme.tokens.colors.surfaceSecondary,
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
								sx={{ color: "primary.main", fontSize: 36 }}
								aria-hidden
							/>
							<Typography sx={{ fontWeight: 700 }}>
								اسحب الملف إلى هنا
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
				{error ? (
					<Typography
						role='alert'
						variant='body2'
						sx={{ color: "error.main", fontWeight: 600 }}
					>
						{error}
					</Typography>
				) : null}
			</Stack>
		</AppDialog>
	);
}
