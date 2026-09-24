"use client";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

const NotFound = () => {
	return (
		<Box
			sx={(theme) => ({
				flex: 1,
				minHeight: "70vh",
				display: "grid",
				placeItems: "center",
				px: 2,
				backgroundImage: `radial-gradient(50% 45% at 50% 0%, ${alpha(theme.tokens.colors.violet, 0.14)}, transparent 70%)`,
			})}
		>
			<Stack
				spacing={2.5}
				alignItems='center'
				textAlign='center'
				sx={{ maxWidth: 480 }}
			>
				<Typography
					aria-hidden
					sx={{
						fontSize: { xs: "4.5rem", md: "6rem" },
						fontWeight: 700,
						lineHeight: 1,
						color: "primary.main",
						direction: "ltr",
						fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
					}}
				>
					404
				</Typography>
				<Typography
					variant='h1'
					sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}
				>
					الصفحة غير موجودة
				</Typography>
				<Typography sx={{ color: "text.secondary" }}>
					يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
				</Typography>
				<Stack direction={{ xs: "column", sm: "row" }} gap={1.5} sx={{ pt: 1 }}>
					<Button component={Link} href='/' size='large'>
						الصفحة الرئيسية
					</Button>
					<Button
						component={Link}
						href='/classes'
						size='large'
						variant='outlined'
						endIcon={<ArrowBackRoundedIcon />}
					>
						تصفّح الصفوف
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export default NotFound;
