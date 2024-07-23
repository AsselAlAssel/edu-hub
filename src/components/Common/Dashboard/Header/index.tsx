"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const APP_BAR_HEIGHT = 80;

const LinkItem = ({
	children,
	href,
}: {
	children: React.ReactNode;
	href: string;
}) => {
	return (
		<Typography
			sx={{
				fontWeight: 600,
				color: "primary.contrastText",
				textAlign: "center",
				height: "100%",
			}}
		>
			<Link
				href={href}
				style={{
					textDecoration: "none",
					color: "inherit",
					height: "100%",
				}}
			>
				{children}
			</Link>
		</Typography>
	);
};

export default function Header({ openSidebar, setOpenSidebar }: any) {
	const { data: session } = useSession();

	return (
		<Box
			sx={(theme) => ({
				borderBottom: `1px solid ${theme.palette.border.main}`,
				height: APP_BAR_HEIGHT,
				zIndex: 999,
				position: "fixed",
				width: "100%",
				top: 0,
				p: 0,
				backgroundColor: theme.palette.primary.main,
			})}
		>
			<PageContainer
				sx={(theme) => ({
					[theme.breakpoints.down("sm")]: {
						px: "32px !important",
					},
				})}
			>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
					height={APP_BAR_HEIGHT}
				>
					<Stack direction='row' spacing={2.5} alignItems='center'>
						<LinkItem href='/'>الرئيسية</LinkItem>
						<LinkItem href='/about'>عن هذه المنصة</LinkItem>
						<LinkItem href='/contact'>اتصل بنا</LinkItem>
						<LinkItem href='/auth/signin'>تسجيل الدخول</LinkItem>
					</Stack>
				</Stack>
			</PageContainer>
		</Box>
	);
}
