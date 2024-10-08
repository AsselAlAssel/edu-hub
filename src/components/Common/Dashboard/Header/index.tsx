"use client";
import PageContainer from "@/components/PageContainer";
import useMuiMediaQuery from "@/hooks/useMuiMediaQuery";
import usePopoverState from "@/hooks/usePopoverState";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
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
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideBar from "../Sidebar";

export const APP_BAR_HEIGHT = 80;

const LinkItem = ({
	children,
	href,
	onClick,
	isSelected,
}: {
	children: React.ReactNode;
	href: string;
	onClick?: () => void;
	isSelected?: boolean;
}) => {
	return (
		<Typography
			sx={{
				fontWeight: 600,
				color: isSelected ? "text.secondaryLight" : "text.primary",
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
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const { isTabletOrLess } = useMuiMediaQuery();
	const pathName = usePathname();

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
				borderBottom: `1px solid #939393`,
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
						<Link href='/'>
							<Image
								src='/images/logo/logo.svg'
								alt='Logo'
								width={50}
								height={50}
							/>
						</Link>
					</Box>
					<Stack
						direction='row'
						justifyContent='center'
						alignItems='center'
						display={{ xs: "none", md: "flex" }}
					>
						<Stack direction='row' spacing={2.5} alignItems='center'>
							<LinkItem href='/#home'>الرئيسية</LinkItem>
							<LinkItem href='/classes' isSelected={pathName === "/classes"}>
								الصفوف
							</LinkItem>
							<LinkItem href='/#about'>عن هذه المنصة</LinkItem>
							<LinkItem href='/#contact'>اتصل بنا</LinkItem>
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
							<Button
								onClick={() => router.push("/classes")}
								sx={{
									backgroundColor: "rgba(0, 130, 210, 1)",
									color: "primary.contrastText",
									borderRadius: 1.5,
									height: 45,
								}}
							>
								إبدأ الآن
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
						router.push(`/admin/profile`);
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
