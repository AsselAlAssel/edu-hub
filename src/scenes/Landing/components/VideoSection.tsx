import { Box } from "@mui/material";
import React from "react";

export default function VideoSection() {
	return (
		<Box sx={{}}>
			<iframe
				width='800'
				height='500'
				src='https://player.vimeo.com/video/989195885'
				title='YouTube video player'
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
				referrerPolicy='strict-origin-when-cross-origin'
				allowFullScreen
			></iframe>
		</Box>
	);
}
