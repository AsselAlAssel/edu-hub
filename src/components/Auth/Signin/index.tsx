"use client";
import { Box, Stack } from "@mui/material";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (<Stack
		direction="column"
		justifyContent="center"
		alignItems="center"
		spacing={2}
		sx={{
			py: 20
		}}
	>
		<Box sx={{
			maxWidth: "400px",
			width: "100%",
		}}
		>
			<SigninWithPassword />
		</Box>
	</Stack>
	);
}
