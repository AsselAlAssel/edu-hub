import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { deleteCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { APP_BAR_HEIGHT } from "./Header";

type SideBarProps = {
	showSideBar: boolean;
	onClose: () => void;
	login: () => void;
	signUp: () => void;
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
	const { t } = useTranslation("common");
	const { showSideBar, onClose, login, signUp } = props;
	const { data } = useSession();
	const user = data?.user;
	const router = useRouter();
	const logout = () => {
		router.push("/");
		deleteCookie("token");
		deleteCookie("userId");
		onClose();
		router.refresh();
	};
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
								<LinkItem href='/' onClick={onClose}>
									الرئيسية
								</LinkItem>
								<LinkItem href='/classes' onClick={onClose}>
									الصفوف
								</LinkItem>
								<LinkItem href='/#about' onClick={onClose}>
									عن هذه المنصة
								</LinkItem>

								<LinkItem href='/contact' onClick={onClose}>
									اتصل بنا
								</LinkItem>
							</Stack>
							<Stack spacing={1.5}>
								{user ? (
									<Button
										onClick={logout}
										variant={"outlined"}
										color='error'
										sx={{
											color: "#B42318",
										}}
									>
										{t("logout")}
									</Button>
								) : (
									<>
										<Button
											onClick={() => {
												login();
												onClose();
											}}
											variant='outlined'
											color='secondary'
											sx={{
												height: 44,
												mr: 1.5,
											}}
										>
											{t("login")}
										</Button>
										<Button
											onClick={() => {
												signUp();
												onClose();
											}}
											sx={{
												height: 44,
											}}
										>
											{t("sign-up")}
										</Button>
									</>
								)}
							</Stack>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</Drawer>
	);
}
