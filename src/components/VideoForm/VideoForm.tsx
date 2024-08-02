import { useUploadVideo } from "@/hooks/useResourceApi";
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
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { mutate } from "swr";

type FolderFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	folderId: string;
	classId: string;
};

export default function VideoForm({
	open,
	handleClose,
	title,
	folderId,
	classId,
}: FolderFormProps) {
	const [file, setFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			console.log(acceptedFiles[0]);
			if (acceptedFiles.length > 0) {
				setFile(acceptedFiles[0]);
			}
		},
	});

	const { isLoading, upload } = useUploadVideo();

	const handleCloseDialog = () => {
		setFile(null);
		handleClose();
	};

	const handleUpload = async (file: File | null) => {
		if (file === null) {
			setErrorMessage("يجب تحديد ملف واحد على الأقل");
			return;
		}
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folderId", folderId);
		formData.append("classId", classId);

		await upload({
			file: formData,
		});
		mutate(`/api/resources/${folderId}`);
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
					<input {...getInputProps()} type='file' accept='video/*' />
					{/* {files.length ? <Typography
                        variant='h6'
                        color='textPrimary'
                    >
                        {files.map(file => file.name).join(', ')}
                    </Typography> :

                        <Typography
                            variant='body1'
                            color='textSecondary'
                        >
                            اسحب الملفات هنا أو انقر لتحميلها
                        </Typography>
                    } */}
					<Typography variant='body1' color='textSecondary'>
						اسحب الملفات هنا أو انقر لتحميلها
					</Typography>
				</Box>
				<Typography variant='body2' color='error' sx={{ mt: 1 }}>
					{errorMessage}
				</Typography>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					fullWidth
					onClick={() => handleUpload(file)}
					loading={isLoading}
				>
					تحميل
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
