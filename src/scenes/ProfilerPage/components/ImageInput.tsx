import { getSignedURL } from "@/actions/upload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	Box,
	CircularProgress,
	IconButton,
	InputLabel,
	Typography,
} from "@mui/material";
import axios from "axios";
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
			{inputLabel && <InputLabel>{inputLabel}</InputLabel>}

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
					position: "relative",
					overflow: "hidden",
				}}
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
					<Typography variant='body1' mb={2} color='textSecondary'>
						{loading ? "تحميل..." : "اسحب الملف هنا أو انقر لتحميله"}
					</Typography>
				)}
				{imageSrc && (
					<>
						<IconButton
							sx={{
								position: "absolute",
								top: 10,
								left: 10,
								zIndex: 2,
								bgcolor: "primary.main",
								color: "white",
							}}
							onClick={() => {
								openDropzone();
							}}
						>
							{loading ? (
								<CircularProgress
									size={20}
									sx={{
										color: "text.primary",
									}}
								/>
							) : (
								<EditIcon />
							)}
						</IconButton>
						<IconButton
							sx={{
								position: "absolute",
								top: 10,
								right: 10,
								zIndex: 2,
								bgcolor: "error.main",
								color: "white",
							}}
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
