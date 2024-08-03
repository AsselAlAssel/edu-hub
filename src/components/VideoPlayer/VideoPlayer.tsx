import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, Box, IconButton } from "@mui/material";
import React, { useState } from "react";

export default function VideoPlayer({
	open,
	handleClose,
	url,
}: {
	open: boolean;
	handleClose: () => void;
	url: string;
}) {
	const [videoUrl, setVideoUrl] = useState(url);

	const handleDialogClose = () => {
		setVideoUrl(""); // Reset the URL to stop the video
		handleClose();
	};

	React.useEffect(() => {
		if (open) {
			setVideoUrl(url); // Reset the URL to the original value when the dialog opens
		}
	}, [open, url]);

	return (
		<Backdrop
			sx={{
				color: "#fff",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={open}
			onClick={handleDialogClose}
		>
			<iframe
				style={{
					width: "100%",
					height: "100%",
					border: "none",
					borderRadius: "8px",
					overflow: "hidden",
					maxWidth: "800px",
					maxHeight: "600px",
				}}
				src={videoUrl}
				loading='lazy'
				allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
				allowFullScreen
			></iframe>

			<Box position='absolute' right={24} top={24} zIndex={1}>
				<IconButton color='default' size='large' onClick={handleDialogClose}>
					<CloseIcon
						sx={{
							color: "white",
							fontSize: "30px",
						}}
					/>
				</IconButton>
			</Box>
		</Backdrop>
	);
}
