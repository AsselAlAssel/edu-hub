import { Box } from "@mui/material";
import React from "react";

export default function VideoSection() {
	return (
		<Box sx={{}}>
			<iframe
				width='800'
				height='500'
				src='https://www.youtube.com/embed/ezAI6oaZkZI?si=3o0509gOJbiCQCSK'
				title='YouTube video player'
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
				referrerPolicy='strict-origin-when-cross-origin'
				allowFullScreen
			></iframe>
		</Box>
	);
}
