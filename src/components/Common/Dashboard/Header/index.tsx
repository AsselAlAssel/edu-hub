"use client";
import PageContainer from "@/components/PageContainer";
import {
	alpha,
	Avatar,
	Box,
	Button,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../Sidebar";
import { useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import usePopoverState from "@/hooks/usePopoverState";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import useMuiMediaQuery from "@/hooks/useMuiMediaQuery";

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
				color: "text.primary",
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

export default function Header() {
	const { data: session } = useSession();
	const user = session?.user;
	const [openSidebar, setOpenSidebar] = useState(false);
	const router = useRouter();
	const { isAdmin } = useRole();
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const { isTabletOrLess } = useMuiMediaQuery();

	const [, setIsScrolled] = useState(false);
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
				backgroundColor: theme.palette.background.paper,
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
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
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
						display={{ xs: "none", md: "flex" }}
					>
						<Stack direction='row' spacing={2.5} alignItems='center'>
							<LinkItem href='/'>الرئيسية</LinkItem>
							<LinkItem href='/classes'>الصفوف</LinkItem>
							{isAdmin ? null : (
								<>
									<LinkItem href='/#about'>عن هذه المنصة</LinkItem>
									<LinkItem href='/contact'>اتصل بنا</LinkItem>
								</>
							)}
						</Stack>
					</Stack>
					<Box
						sx={{
							marginLeft: "auto",
							flex: 1,
							justifyContent: "flex-end",
							display: { xs: "none", md: "flex" },
						}}
					>
						{session ? (
							<Avatar
								sx={(theme) => ({
									width: 40,
									height: 40,
									border: "1px solid",
									borderColor: alpha("#000", 0.08),
									backgroundColor: theme.palette.primary.main,
									fontSize: 20,
									cursor: "pointer",
								})}
								onClick={(e) => {
									if (isTabletOrLess) {
										setOpenSidebar(true);
										return;
									}
									handleOpen(e);
								}}
							>
								{user?.name?.charAt(0)?.toUpperCase() || "A"}
							</Avatar>
						) : (
							<Button onClick={() => router.push("/auth/signin")}>
								تسجيل الدخول
							</Button>
						)}
					</Box>
					<Box
						sx={{
							display: { xs: "flex", md: "none" },
						}}
					>
						{openSidebar ? (
							<CloseIcon
								onClick={() => setOpenSidebar(!openSidebar)}
								sx={{
									cursor: "pointer",
								}}
							/>
						) : (
							<MenuIcon
								onClick={() => setOpenSidebar(!openSidebar)}
								sx={{
									cursor: "pointer",
								}}
							/>
						)}
					</Box>
				</Stack>
			</PageContainer>
			<Menu
				sx={{
					mt: "50px",
				}}
				id='menu-appbar'
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						sx: {
							minWidth: 240,
							boxShadow: "0px 4px 9px rgba(48, 60, 88, 0.07)",
							p: 0,
						},
					},
				}}
			>
				<MenuItem
					onClick={() => {
						router.push(`/home`);
						handleClose();
					}}
					sx={{
						py: 1.5,
						px: 2,
					}}
				>
					<Stack direction='row' spacing={8} alignItems={"center"}>
						<Stack direction='row' spacing={1.5}>
							<Avatar
								sx={(theme) => ({
									width: 40,
									height: 40,
									border: "1px solid",
									borderColor: alpha("#000", 0.08),
									backgroundColor: theme.palette.primary.main,
									fontSize: 20,
								})}
							>
								{user?.name?.[0]?.toUpperCase()}
							</Avatar>
							<Box>
								<ListItemText
									sx={{
										"& .MuiTypography-root": {
											fontWeight: "600 !important",
										},
									}}
								>
									{user?.name}
								</ListItemText>
								<ListItemText
									sx={{
										color: "text.tertiary",
										fontWeight: 400,
									}}
								>
									{user?.email}
								</ListItemText>
							</Box>
						</Stack>
						<ArrowRightAltIcon
							sx={{
								color: "primary.main",
								fontSize: 20,
							}}
						/>
					</Stack>
				</MenuItem>
				<MenuItem
					onClick={() => {
						router.push("/");
						signOut();
					}}
					sx={{
						borderTop: "1px solid #D0D5DD",
						borderRadius: "0px",
						py: 1.75,
						px: 2,
					}}
				>
					<ListItemIcon>
						<LogoutIcon
							sx={{
								fontSize: 16,
							}}
						/>
					</ListItemIcon>
					<ListItemText>تسجيل الخروج</ListItemText>
				</MenuItem>
			</Menu>
			<SideBar
				login={() => {
					router.push("/auth/signin");
				}}
				showSideBar={openSidebar}
				onClose={() => setOpenSidebar(false)}
			/>
		</Box>
	);
}
