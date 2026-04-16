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
				variant='h3'
				sx={{
					fontWeight: 800,
					textAlign: "center",
					letterSpacing: "-0.01em",
				}}
			>
				الصفحة غير موجودة
			</Typography>
			<Typography
				sx={{
					color: "text.tertiary",
					textAlign: "center",
					maxWidth: 420,
					fontSize: "1.0625rem",
					lineHeight: 1.7,
				}}
			>
				يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
			</Typography>
			<Link href='/' style={{ textDecoration: "none" }}>
				<Button
					size='large'
					sx={{
						px: 5,
						borderRadius: "14px",
						fontWeight: 700,
						fontSize: "1rem",
						boxShadow: "0 4px 14px rgba(0, 136, 221, 0.2)",
						"&:hover": {
							boxShadow: "0 8px 24px rgba(0, 136, 221, 0.25)",
						},
					}}
				>
					الرجوع للصفحة الرئيسية
				</Button>
			</Link>
		</Stack>
	);
};

export default NotFound;
