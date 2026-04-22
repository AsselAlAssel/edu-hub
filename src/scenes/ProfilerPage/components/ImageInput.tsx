import { getSignedURL } from "@/actions/upload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	alpha,
	Box,
	CircularProgress,
	IconButton,
	InputLabel,
	Typography,
} from "@mui/material";
import { putFileToPresignedUrl } from "@/services/upload.service";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

type ImageInputProps = {
	onChangeImage: (url: string | null) => void;
	imageSrc: string | null;
	inputLabel?: string;
};

export default function ImageInput(props: ImageInputProps) {
	const { onChangeImage, imageSrc, inputLabel } = props;
	const [loading, setLoading] = React.useState(false);

	const handleFileUpload = async (file: File) => {
		const signedUrl = await getSignedURL(file.type, file.size);
		if (signedUrl.failure !== undefined) {
			toast.error(signedUrl.failure);

			return null;
		}

		const url = signedUrl.success.url;
		const response = await putFileToPresignedUrl(url, file);

		if (response.status !== 200) {
			return null;
		}

		return signedUrl.success.key;
	};
	const {
		getRootProps,
		getInputProps,
		open: openDropzone,
	} = useDropzone({
		noClick: true,
		noKeyboard: true,
		accept: {
			"image/*": [".png", ".gif", ".jpeg", ".jpg"],
		},
		onDrop: async (acceptedFiles) => {
			if (acceptedFiles.length === 0) {
				return;
			}
			setLoading(true);
			const file = acceptedFiles[0];
			const fileKey = await handleFileUpload(file);
			const url = `${process.env.NEXT_PUBLIC_FILES_URL}/${fileKey}`;
			onChangeImage(url);
			setLoading(false);
		},
	});
	return (
		<Box>
			{inputLabel && (
				<InputLabel sx={{ color: "text.secondary", mb: 0.5 }}>
					{inputLabel}
				</InputLabel>
			)}

			<Box
				{...getRootProps()}
				sx={(theme) => ({
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					p: 3,
					border: "1px dashed",
					borderColor: theme.palette.divider,
					borderRadius: 1,
					cursor: "pointer",
					height: 200,
					position: "relative",
					overflow: "hidden",
					backgroundColor:
						theme.palette.mode === "dark"
							? "rgba(255,255,255,0.03)"
							: alpha(theme.palette.primary.main, 0.04),
				})}
				onClick={() => {
					openDropzone();
				}}
			>
				<input {...getInputProps()} />
				{imageSrc ? (
					<Image
						src={imageSrc}
						alt='header image'
						width={200}
						height={200}
						style={{
							maxHeight: "100%",
							width: "auto",
							height: "auto",
						}}
					/>
				) : (
					<Typography variant='body1' mb={2} color='text.secondary'>
						{loading ? "تحميل..." : "اسحب الملف هنا أو انقر لتحميله"}
					</Typography>
				)}
				{imageSrc && (
					<>
						<IconButton
							sx={(theme) => ({
								position: "absolute",
								top: 10,
								left: 10,
								zIndex: 2,
								bgcolor: "primary.main",
								color: theme.palette.primary.contrastText,
							})}
							onClick={() => {
								openDropzone();
							}}
						>
							{loading ? (
								<CircularProgress
									size={20}
									sx={(theme) => ({
										color: theme.palette.primary.contrastText,
									})}
								/>
							) : (
								<EditIcon />
							)}
						</IconButton>
						<IconButton
							sx={(theme) => ({
								position: "absolute",
								top: 10,
								right: 10,
								zIndex: 2,
								bgcolor: "error.main",
								color: theme.palette.error.contrastText,
							})}
							onClick={() => {
								onChangeImage("");
							}}
						>
							<DeleteIcon />
						</IconButton>
					</>
				)}
			</Box>
		</Box>
	);
}
