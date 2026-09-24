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
import { motion, useScroll, useSpring } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SideBar from "../Sidebar";

export { APP_BAR_HEIGHT };

/** Reading progress along the header's bottom edge (fills from the right in RTL). */
function ScrollProgress() {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 160,
		damping: 30,
		restDelta: 0.001,
	});
	return (
		<motion.div
			aria-hidden
			style={{
				scaleX,
				position: "absolute",
				insetInline: 0,
				bottom: -1,
				height: 2,
				// The site is RTL-only: progress grows from the reading start (right).
				transformOrigin: "right",
				backgroundImage: "var(--qa-gradient-text)",
				pointerEvents: "none",
			}}
		/>
	);
}

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
				backgroundColor: alpha(theme.tokens.colors.bg, scrolled ? 0.72 : 0),
				backdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
				WebkitBackdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
				boxShadow: scrolled ? theme.tokens.shadows.subtle : "none",
				transition: theme.transitions.create([
					"background-color",
					"border-color",
					"box-shadow",
				]),
			})}
		>
			{/* Reading progress belongs to the long landing page only. */}
			{pathname === "/" ? <ScrollProgress /> : null}
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
							sx={{ listStyle: "none", m: 0, p: 0, isolation: "isolate" }}
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
												position: "relative",
												display: "block",
												px: 2,
												py: 1,
												borderRadius: `${theme.tokens.radii.full}px`,
												fontWeight: active ? 600 : 500,
												fontSize: "1rem",
												textDecoration: "none",
												color: active
													? theme.palette.mode === "dark"
														? "primary.light"
														: "primary.main"
													: "text.secondary",
												transition: theme.transitions.create("color"),
												"&:hover": { color: "text.primary" },
											})}
										>
											{/* Shared-layout pill glides between active items. */}
											{active ? (
												<motion.span
													layoutId='qa-nav-pill'
													transition={{
														type: "spring",
														stiffness: 380,
														damping: 32,
													}}
													aria-hidden
													style={{
														position: "absolute",
														inset: 0,
														zIndex: -1,
														borderRadius: "inherit",
														backgroundColor:
															"color-mix(in srgb, var(--qa-cyan) 12%, transparent)",
														border:
															"1px solid color-mix(in srgb, var(--qa-cyan) 38%, transparent)",
														boxShadow:
															"0 0 18px color-mix(in srgb, var(--qa-cyan) 16%, transparent)",
													}}
												/>
											) : null}
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
					<Typography sx={{ fontWeight: 700 }}>{user?.name}</Typography>
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
