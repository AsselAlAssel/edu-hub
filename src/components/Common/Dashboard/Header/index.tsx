"use client";
import PageContainer from "@/components/PageContainer";
import useMuiMediaQuery from "@/hooks/useMuiMediaQuery";
import usePopoverState from "@/hooks/usePopoverState";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
	alpha,
	Avatar,
	Box,
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
import { APP_BAR_HEIGHT } from "@/constants/appShell";
import { useLandingScrollSpy } from "@/hooks/useLandingScrollSpy";
import SideBar from "../Sidebar";

export { APP_BAR_HEIGHT };

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
		textDecoration: "none",
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
	const landingActiveSection = useLandingScrollSpy(pathName === "/");

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
				borderColor: isScrolled
					? alpha(theme.palette.border.main, 0.45)
					: "transparent",
				backgroundColor: isScrolled
					? alpha(theme.palette.background.paper, 0.92)
					: theme.palette.background.paper,
				backdropFilter: isScrolled ? "blur(14px)" : "none",
				WebkitBackdropFilter: isScrolled ? "blur(14px)" : "none",
				transition: theme.transitions.create(
					["background-color", "border-color", "box-shadow"],
					{ duration: 220 }
				),
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
					spacing={2}
				>
					<Box
						sx={{
							flex: "1 1 0",
							display: "flex",
							justifyContent: "flex-start",
							minWidth: 0,
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
						sx={{ flexShrink: 0 }}
					>
						<Stack direction='row' spacing={2.75} alignItems='center'>
							<LinkItem
								href='/#home'
								isSelected={pathName === "/" && landingActiveSection === "home"}
							>
								الرئيسية
							</LinkItem>
							<LinkItem href='/classes' isSelected={pathName === "/classes"}>
								الصفوف
							</LinkItem>
							<LinkItem
								href='/#about'
								isSelected={
									pathName === "/" && landingActiveSection === "about"
								}
							>
								عن هذه المنصة
							</LinkItem>
							<LinkItem
								href='/#contact'
								isSelected={
									pathName === "/" && landingActiveSection === "contact"
								}
							>
								اتصل بنا
							</LinkItem>
						</Stack>
					</Stack>
					<Stack
						direction='row'
						alignItems='center'
						justifyContent='flex-end'
						spacing={1}
						sx={{ flex: "1 1 0", minWidth: 0 }}
					>
						<ThemeToggle />
						{session ? (
							<>
								<Avatar
									sx={(theme) => ({
										display: { xs: "none", md: "flex" },
										width: 40,
										height: 40,
										border: "2px solid",
										borderColor: alpha(theme.palette.primary.main, 0.12),
										backgroundColor: theme.palette.primary.main,
										fontSize: 18,
										fontWeight: 700,
										cursor: "pointer",
										transition: theme.transitions.create(
											["border-color", "box-shadow", "transform"],
											{ duration: 180 }
										),
										"&:hover": {
											borderColor: theme.palette.primary.main,
											boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
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
								<IconButton
									onClick={() => setOpenSidebar(!openSidebar)}
									aria-label={openSidebar ? "إغلاق القائمة" : "فتح القائمة"}
									sx={{
										display: { xs: "inline-flex", md: "none" },
										color: "text.primary",
									}}
								>
									{openSidebar ? <CloseIcon /> : <MenuIcon />}
								</IconButton>
							</>
						) : (
							<IconButton
								onClick={() => setOpenSidebar(!openSidebar)}
								aria-label={openSidebar ? "إغلاق القائمة" : "فتح القائمة"}
								sx={{
									display: { xs: "inline-flex", md: "none" },
									color: "text.primary",
								}}
							>
								{openSidebar ? <CloseIcon /> : <MenuIcon />}
							</IconButton>
						)}
					</Stack>
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
					sx={(theme) => ({
						borderTop: `1px solid ${theme.palette.divider}`,
						borderRadius: "0px",
						py: 1.75,
						px: 2,
					})}
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
				landingActiveSection={
					pathName === "/" ? landingActiveSection : undefined
				}
			/>
		</Box>
	);
}
