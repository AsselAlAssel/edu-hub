import { getSignedURL } from "@/actions/upload";
import { useAddFile } from "@/hooks/useResourceApi";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { mutate } from "swr";

type FolderFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	folderId: string;
	classId: string;
};

export default function AttachmentsForm({
	open,
	handleClose,
	title,
	folderId,
	classId,
}: FolderFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { addFile } = useAddFile();

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length > 0) {
				setFile(acceptedFiles[0]);
			}
		},
	});

	const handleCloseDialog = () => {
		setFile(null);
		handleClose();
	};

	const handleFileUpload = async (file: File) => {
		const signedUrl = await getSignedURL(file.type, file.size);
		if (signedUrl.failure !== undefined) {
			toast.error(signedUrl.failure);

			return null;
		}

		const url = signedUrl.success.url;
		const response = await axios.put(url, file, {
			headers: {
				"Content-Type": file.type,
			},
		});

		if (response.status !== 200) {
			return null;
		}

		return signedUrl.success.key;
	};

	const handleSubmit = async (file: File | null) => {
		try {
			setErrorMessage(null);
			setIsLoading(true);
			if (file === null) {
				setErrorMessage("يجب تحديد ملف واحد على الأقل");
				return;
			}
			const fileKey = await handleFileUpload(file);
			if (fileKey === null) {
				toast.error("فشل تحميل الملف");
				return;
			}
			const url = `${process.env.NEXT_PUBLIC_FILES_URL}/${fileKey}`;
			await addFile({
				name: file.name,
				url,
				folderId,
				classId,
				type: file.name.split(".").pop() || "",
			});
			mutate(`/api/resources/${folderId}`);
			handleCloseDialog();
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("فشل تحميل الملف");
		}
		setIsLoading(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleCloseDialog}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				style: {
					maxWidth: 400,
				},
			}}
		>
			<Box position='absolute' right={24} top={24}>
				<IconButton color='default' size='small' onClick={handleCloseDialog}>
					<CloseIcon fontSize='inherit' />
				</IconButton>
			</Box>
			<DialogTitle
				sx={{
					p: 3,
					pb: 4,
				}}
			>
				<Typography
					sx={(theme) => ({
						fontSize: theme.typography.pxToRem(18),
						lineHeight: theme.typography.pxToRem(28),
						fontWeight: 600,
						mt: 2,
						position: "relative",
						zIndex: 1,
					})}
				>
					{title}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Box
					{...getRootProps()}
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						p: 3,
						border: "1px dashed",
						borderColor: "grey.300",
						borderRadius: 1,
						cursor: "pointer",
						height: 200,
					}}
				>
					<input {...getInputProps()} />
					<Typography variant='body1' mb={2} color='textSecondary'>
						اسحب الملفات هنا أو انقر لتحميلها
					</Typography>
					{file ? <Typography variant='body1'>{file.name}</Typography> : null}
				</Box>
				<Typography variant='body2' color='error' sx={{ mt: 1 }}>
					{errorMessage}
				</Typography>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					fullWidth
					onClick={() => handleSubmit(file)}
					loading={isLoading}
					loadingIndicator='تحميل...'
				>
					تحميل
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
