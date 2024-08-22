import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
	return (
		<Stack
			justifyContent='center'
			alignItems='center'
			height='100vh'
			spacing={2}
		>
			<Image src='/images/404.jpg' alt='404' width={300} height={300} />
			<Link href='/'>
				<Typography
					variant='h6'
					sx={{
						cursor: "pointer",
						textDecoration: "none",
						color: "text.primary",
					}}
				>
					الرجوع للصفحة الرئيسية
				</Typography>
			</Link>
		</Stack>
	);
};

export default NotFound;
