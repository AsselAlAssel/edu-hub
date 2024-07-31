"use client";
import PageContainer from "@/components/PageContainer";
import { Box, Button, Stack, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const APP_BAR_HEIGHT = 80;

const LinkItem = ({
	children,
	href,
	onClick,
}: {
	children: React.ReactNode;
	href: string;
	onClick?: () => void;
}) => {
	return (
		<Typography
			sx={{
				fontWeight: 600,
				color: "primary.main",
				textAlign: "center",
				height: "100%",
			}}
			onClick={onClick}
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

	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<Box
			sx={(theme) => ({
				height: APP_BAR_HEIGHT,
				zIndex: 999,
				position: "fixed",
				width: "100%",
				top: 0,
				p: 0,
				borderBottom: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.background.paper
			})}
		>
			<PageContainer
				sx={(theme) => ({
					[theme.breakpoints.down("sm")]: {
						px: "32px !important",
					},
					minHeight: APP_BAR_HEIGHT,
					maxHeight: APP_BAR_HEIGHT,
				})}
			>
				<Stack direction='row' justifyContent='space-between' alignItems='center'
					height={APP_BAR_HEIGHT}
				>
					<Box
						sx={{
							flex: 1,
							display: "flex",
							justifyContent: "flex-start",
							marginRight: "auto",
						}}
					>
						Logo
					</Box>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
					>
						<Stack direction='row' spacing={2.5} alignItems='center'>
							<LinkItem href='/'>الرئيسية</LinkItem>
							<LinkItem href='/classes'>الصفوف</LinkItem>
							<LinkItem href='/about'>عن هذه المنصة</LinkItem>

							<LinkItem href='/contact'>اتصل بنا</LinkItem>

						</Stack>
					</Stack>
					<Box
						sx={{
							marginLeft: "auto",
							flex: 1,
							justifyContent: "flex-end",
							display: "flex",
						}}
					>
						{session ? (
							<Button href='#'
								onClick={() => signOut()}
							>تسجيل الخروج</Button>
						) : (
							<Button href='/auth/signin'

							>تسجيل الدخول</Button>
						)}
					</Box>

				</Stack>
			</PageContainer>
		</Box >
	);
}
