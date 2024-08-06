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
// @ts-expect-error: tus-js-client has no types
import tus from "tus-js-client";

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

		const response = await upload({
			file: formData,
		});
		const {
			videoId,
			collectionId,
			AuthorizationSignature,
			AuthorizationExpire,
			LibraryId,
		} = response;
		const upload1 = new tus.Upload(file, {
			endpoint: "https://video.bunnycdn.com/tusupload",
			retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
			headers: {
				AuthorizationSignature: AuthorizationSignature,
				AuthorizationExpire: AuthorizationExpire,
				VideoId: videoId,
				LibraryId: LibraryId,
			},
			metadata: {
				filetype: file.type,
				title: file.name,
				collection: collectionId,
			},
			onError: function () {
				// todo handle delete video
			},
			onProgress: function (bytesUploaded: any, bytesTotal: any) {
				console.log(videoId);
				const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
				console.log(bytesUploaded, bytesTotal, percentage + "%");
			},
			onSuccess: function () {
				console.log("Download " + upload1.file.name + " from " + upload1.url);
			},
		});
		upload1.start();
		mutate(`/api/resources/${folderId}`);
		handleCloseDialog();
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
					<input {...getInputProps()} type='file' />
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
