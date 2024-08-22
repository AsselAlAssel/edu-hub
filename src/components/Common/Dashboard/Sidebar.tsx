import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { APP_BAR_HEIGHT } from "./Header";

type SideBarProps = {
	showSideBar: boolean;
	onClose: () => void;
	login: () => void;
};
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
				color: "text.tertiary",
				width: "100%",
			}}
			onClick={onClick}
		>
			<Link
				href={href}
				style={{
					textDecoration: "none",
					color: "inherit",
					width: "100%",
					display: "block",
				}}
			>
				{children}
			</Link>
		</Typography>
	);
};

export default function SideBar(props: SideBarProps) {
	const { showSideBar, onClose } = props;
	const { data } = useSession();
	const user = data?.user;
	const router = useRouter();
	return (
		<Drawer
			open={showSideBar}
			anchor='right'
			onClose={onClose}
			transitionDuration={{
				appear: 400,
				enter: 400,
				exit: 400,
			}}
			sx={{
				zIndex: 99,
			}}
			PaperProps={{
				sx: {
					width: "100%",
					pt: `${APP_BAR_HEIGHT}px`,
				},
			}}
		>
			<Box height={`calc(100svh - ${APP_BAR_HEIGHT}px - 48px)`} m={3}>
				<Stack height={"100%"} flex={1} justifyContent={"space-between"}>
					<Box height={"100%"}>
						<Stack
							spacing={4}
							flex={1}
							height={"100%"}
							justifyContent={"space-between"}
						>
							<Stack spacing={4} mt={user ? 4 : 0}>
								<LinkItem href='/#home' onClick={onClose}>
									الرئيسية
								</LinkItem>
								<LinkItem href='/classes' onClick={onClose}>
									الصفوف
								</LinkItem>
								<LinkItem href='/#about' onClick={onClose}>
									عن هذه المنصة
								</LinkItem>

								<LinkItem href='/#contact' onClick={onClose}>
									اتصل بنا
								</LinkItem>
							</Stack>
							<Stack spacing={1.5}>
								{
									user ? (
										<Button
											onClick={async () => {
												await signOut();
												router.push("/");
											}}
											variant={"outlined"}
											color='error'
											sx={{
												color: "#B42318",
											}}
										>
											تسجيل الخروج
										</Button>
									) : null
									// <Button
									// 	onClick={() => {
									// 		login();
									// 		onClose();
									// 	}}
									// 	variant='outlined'
									// 	color='secondary'
									// 	sx={{
									// 		height: 44,
									// 		mr: 1.5,
									// 	}}
									// >
									// 	تسجيل الدخول
									// </Button>
								}
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Drawer>
	);
}
