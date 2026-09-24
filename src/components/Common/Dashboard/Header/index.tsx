"use client";
import Logo from "@/components/AppShell/Logo";
import PageContainer from "@/components/PageContainer";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { APP_BAR_HEIGHT } from "@/constants/appShell";
import { isNavItemActive, NAV_ITEMS } from "@/constants/navigation";
import { useLandingScrollSpy } from "@/hooks/useLandingScrollSpy";
import usePopoverState from "@/hooks/usePopoverState";
import { Role } from "@/types/enums";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
	Avatar,
	Box,
	ButtonBase,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Stack,
	Typography,
	useScrollTrigger,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SideBar from "../Sidebar";

export { APP_BAR_HEIGHT };

/** Sticky site header: brand, primary nav, theme toggle, account menu, mobile drawer. */
export default function Header() {
	const { data: session } = useSession();
	const user = session?.user;
	const isAdmin = user?.role === Role.ADMIN;
	const pathname = usePathname();
	const activeSection = useLandingScrollSpy(pathname === "/");
	const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [menuOpen, anchorEl, openMenu, closeMenu] = usePopoverState();

	return (
		<Box
			component='header'
			sx={(theme) => ({
				position: "sticky",
				top: 0,
				zIndex: theme.zIndex.appBar,
				height: APP_BAR_HEIGHT,
				borderBottom: "1px solid",
				borderColor: scrolled ? theme.tokens.colors.border : "transparent",
				backgroundColor: alpha(theme.tokens.colors.bg, scrolled ? 0.85 : 1),
				backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
				transition: theme.transitions.create([
					"background-color",
					"border-color",
				]),
			})}
		>
			<PageContainer sx={{ height: "100%" }}>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					height='100%'
					gap={2}
				>
					<Logo />

					<Box
						component='nav'
						aria-label='التنقل الرئيسي'
						sx={{ display: { xs: "none", md: "block" } }}
					>
						<Stack
							component='ul'
							direction='row'
							gap={0.5}
							sx={{ listStyle: "none", m: 0, p: 0 }}
						>
							{NAV_ITEMS.map((item) => {
								const active = isNavItemActive(item, pathname, activeSection);
								return (
									<li key={item.href}>
										<Box
											component={Link}
											href={item.href}
											aria-current={active ? "page" : undefined}
											sx={(theme) => ({
												display: "block",
												px: 1.75,
												py: 1,
												borderRadius: `${theme.tokens.radii.sm}px`,
												fontWeight: 700,
												fontSize: "0.9375rem",
												textDecoration: "none",
												color: active ? "primary.main" : "text.secondary",
												backgroundColor: active
													? alpha(theme.palette.primary.main, 0.1)
													: "transparent",
												transition: theme.transitions.create([
													"color",
													"background-color",
												]),
												"&:hover": {
													color: "text.primary",
													backgroundColor: "action.hover",
												},
											})}
										>
											{item.label}
										</Box>
									</li>
								);
							})}
						</Stack>
					</Box>

					<Stack direction='row' alignItems='center' gap={1}>
						<ThemeToggle />
						{user ? (
							<ButtonBase
								onClick={openMenu}
								aria-label='قائمة الحساب'
								aria-haspopup='menu'
								aria-expanded={menuOpen}
								aria-controls={menuOpen ? "account-menu" : undefined}
								sx={{
									display: { xs: "none", md: "inline-flex" },
									borderRadius: "50%",
								}}
							>
								<Avatar sx={{ width: 38, height: 38, fontSize: "1rem" }}>
									{user.name?.charAt(0)?.toUpperCase() || "م"}
								</Avatar>
							</ButtonBase>
						) : null}
						<IconButton
							onClick={() => setDrawerOpen(true)}
							aria-label='فتح القائمة'
							aria-haspopup='dialog'
							aria-expanded={drawerOpen}
							sx={{
								display: { xs: "inline-flex", md: "none" },
								color: "text.primary",
							}}
						>
							<MenuRoundedIcon />
						</IconButton>
					</Stack>
				</Stack>
			</PageContainer>

			<Menu
				id='account-menu'
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={closeMenu}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				disableScrollLock
			>
				<Box sx={{ px: 1.5, py: 1.25, minWidth: 220 }}>
					<Typography sx={{ fontWeight: 800 }}>{user?.name}</Typography>
					<Typography
						variant='caption'
						sx={{
							color: "text.secondary",
							direction: "ltr",
							display: "block",
							textAlign: "end",
						}}
					>
						{user?.email}
					</Typography>
				</Box>
				<Divider sx={{ my: 0.5 }} />
				{isAdmin ? (
					<MenuItem component={Link} href='/admin/profile' onClick={closeMenu}>
						<ListItemIcon>
							<DashboardOutlinedIcon fontSize='small' />
						</ListItemIcon>
						لوحة التحكم
					</MenuItem>
				) : null}
				<MenuItem
					onClick={() => {
						closeMenu();
						void signOut({ callbackUrl: "/" });
					}}
					sx={{ color: "error.main" }}
				>
					<ListItemIcon>
						<LogoutRoundedIcon fontSize='small' />
					</ListItemIcon>
					تسجيل الخروج
				</MenuItem>
			</Menu>

			<SideBar
				showSideBar={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				landingActiveSection={activeSection}
			/>
		</Box>
	);
}
