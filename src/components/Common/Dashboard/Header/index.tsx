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
	IconButton,
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
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import SideBar from "../Sidebar";

export const APP_BAR_HEIGHT = 72;

const selectedAfterStyle = {
	"&::after": {
		content: '""',
		position: "absolute",
		bottom: -4,
		right: 0,
		left: 0,
		height: 2,
		borderRadius: 1,
		backgroundColor: "primary.main",
	},
};

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
			component='span'
			sx={{
				fontWeight: 600,
				fontSize: "0.9375rem",
				color: isSelected ? "primary.main" : "text.tertiary",
				textAlign: "center",
				position: "relative",
				transition: "color 0.2s ease",
				px: 0.5,
				"&:hover": {
					color: "primary.main",
				},
				...(isSelected ? selectedAfterStyle : {}),
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

	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<Box
			component='header'
			role='banner'
			sx={(theme) => ({
				height: APP_BAR_HEIGHT,
				zIndex: 999,
				position: "fixed",
				width: "100%",
				top: 0,
				p: 0,
				borderBottom: "1px solid",
				borderColor: isScrolled ? alpha("#D0D5DD", 0.5) : "transparent",
				backgroundColor: isScrolled
					? alpha(theme.palette.background.paper, 0.88)
					: theme.palette.background.paper,
				backdropFilter: isScrolled ? "blur(16px)" : "none",
				WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
				transition: "all 0.3s ease",
			})}
		>
			<PageContainer
				sx={(theme) => ({
					[theme.breakpoints.down("sm")]: {
						px: "20px !important",
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
						<Link href='/' aria-label='الصفحة الرئيسية'>
							<Image
								src='/images/logo/logo.svg'
								alt='شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh'
								width={44}
								height={44}
							/>
						</Link>
					</Box>
					<Stack
						component='nav'
						aria-label='القائمة الرئيسية'
						direction='row'
						justifyContent='center'
						alignItems='center'
						display={{ xs: "none", md: "flex" }}
					>
						<Stack direction='row' spacing={3} alignItems='center'>
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
									border: "2px solid",
									borderColor: alpha(theme.palette.primary.main, 0.15),
									backgroundColor: theme.palette.primary.main,
									fontSize: 18,
									fontWeight: 700,
									cursor: "pointer",
									transition: "all 0.2s ease",
									"&:hover": {
										borderColor: theme.palette.primary.main,
										boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
									},
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
								size='small'
								sx={{
									height: 42,
									px: 3,
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
						<IconButton
							onClick={() => setOpenSidebar(!openSidebar)}
							aria-label={openSidebar ? "إغلاق القائمة" : "فتح القائمة"}
							sx={{
								color: "text.primary",
							}}
						>
							{openSidebar ? <CloseIcon /> : <MenuIcon />}
						</IconButton>
					</Box>
				</Stack>
			</PageContainer>
			<Menu
				sx={{
					mt: "8px",
				}}
				id='menu-appbar'
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
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
							minWidth: 260,
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
									border: "2px solid",
									borderColor: alpha(theme.palette.primary.main, 0.15),
									backgroundColor: theme.palette.primary.main,
									fontSize: 18,
									fontWeight: 700,
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
						borderTop: "1px solid #EAECF0",
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
