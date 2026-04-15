import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
	return (
		<Stack
			justifyContent='center'
			alignItems='center'
			height='100vh'
			spacing={3}
			sx={{ px: 3 }}
		>
			<Image src='/images/404.jpg' alt='404' width={280} height={280} />
			<Typography
				variant='h4'
				sx={{
					fontWeight: 700,
					textAlign: "center",
				}}
			>
				الصفحة غير موجودة
			</Typography>
			<Typography
				sx={{
					color: "text.tertiary",
					textAlign: "center",
					maxWidth: 400,
				}}
			>
				يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
			</Typography>
			<Link href='/' style={{ textDecoration: "none" }}>
				<Button size='medium' sx={{ px: 4 }}>
					الرجوع للصفحة الرئيسية
				</Button>
			</Link>
		</Stack>
	);
};

export default NotFound;
