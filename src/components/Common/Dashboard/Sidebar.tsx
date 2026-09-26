"use client";

import Logo from "@/components/AppShell/Logo";
import { isNavItemActive, NAV_ITEMS } from "@/constants/navigation";
import { Role } from "@/types/enums";
import type { LandingSectionId } from "@/types/landingNav";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SideBarProps = {
	showSideBar: boolean;
	onClose: () => void;
	landingActiveSection?: LandingSectionId | null;
};

/** Mobile navigation drawer (focus-trapped, Escape closes, opens from the start side). */
export default function SideBar({
	showSideBar,
	onClose,
	landingActiveSection = null,
}: SideBarProps) {
	const { data } = useSession();
	const user = data?.user;
	const isAdmin = user?.role === Role.ADMIN;
	const pathname = usePathname();

	const linkSx =
		(active: boolean) => (theme: import("@mui/material").Theme) => ({
			display: "block",
			px: 2,
			py: 1.5,
			borderRadius: `${theme.tokens.radii.md}px`,
			fontWeight: active ? 600 : 500,
			fontSize: "1.125rem",
			textDecoration: "none",
			color: active ? theme.palette.primary.main : theme.palette.text.primary,
			backgroundColor: active
				? alpha(theme.tokens.colors.cyan, 0.12)
				: "transparent",
			borderInlineStart: `3px solid ${active ? theme.tokens.colors.cyan : "transparent"}`,
			transition: theme.transitions.create(["background-color", "transform"]),
			"&:hover": {
				backgroundColor: theme.palette.action.hover,
				transform: "translateX(-4px)",
			},
		});

	return (
		<Drawer
			open={showSideBar}
			// MUI mirrors horizontal anchors under RTL: "left" opens from the right (start) edge.
			anchor='left'
			onClose={onClose}
			// Springy ease-out on enter, quick exit.
			transitionDuration={{ enter: 480, exit: 260 }}
			SlideProps={{
				easing: {
					enter: "cubic-bezier(0.22, 1.2, 0.36, 1)",
					exit: "cubic-bezier(0.4, 0, 1, 1)",
				},
			}}
			PaperProps={{
				sx: (theme) => ({
					width: "min(360px, 100%)",
					display: "flex",
					flexDirection: "column",
					backgroundColor: alpha(theme.tokens.colors.surface, 0.92),
					backgroundImage: `radial-gradient(120% 50% at 100% 0%, ${alpha(theme.tokens.colors.cyan, 0.12)}, transparent 60%)`,
					backdropFilter: "blur(18px)",
					borderInlineEnd: `1px solid ${alpha(theme.tokens.colors.cyan, 0.2)}`,
				}),
				"aria-label": "القائمة",
			}}
		>
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				sx={{ px: 2, py: 2 }}
			>
				<Logo onClick={onClose} />
				<IconButton onClick={onClose} aria-label='إغلاق القائمة'>
					<CloseRoundedIcon />
				</IconButton>
			</Stack>
			<Divider />

			<Box component='nav' aria-label='التنقل الرئيسي' sx={{ p: 2, flex: 1 }}>
				<Stagger onMount delay={0.12} gap={0.06}>
					<Stack
						component='ul'
						spacing={0.5}
						sx={{ listStyle: "none", m: 0, p: 0 }}
					>
						{NAV_ITEMS.map((item) => {
							const active = isNavItemActive(
								item,
								pathname,
								landingActiveSection
							);
							return (
								<StaggerItem as='li' key={item.href}>
									<Box
										component={Link}
										href={item.href}
										onClick={onClose}
										aria-current={active ? "page" : undefined}
										sx={linkSx(active)}
									>
										{item.label}
									</Box>
								</StaggerItem>
							);
						})}
						{isAdmin ? (
							<StaggerItem as='li'>
								<Box
									component={Link}
									href='/admin/profile'
									onClick={onClose}
									aria-current={
										pathname.startsWith("/admin") ? "page" : undefined
									}
									sx={linkSx(pathname.startsWith("/admin"))}
								>
									<Stack direction='row' alignItems='center' gap={1}>
										<DashboardOutlinedIcon fontSize='small' />
										لوحة التحكم
									</Stack>
								</Box>
							</StaggerItem>
						) : null}
					</Stack>
				</Stagger>
			</Box>

			{/* Guests get no sign-in button (matches the desktop header); admins use /auth/signin. */}
			{user ? (
				<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
					<Stack spacing={2}>
						<Stack direction='row' alignItems='center' gap={1.5}>
							<Avatar sx={{ width: 40, height: 40 }}>
								{user.name?.charAt(0)?.toUpperCase() || "م"}
							</Avatar>
							<Box sx={{ minWidth: 0 }}>
								<Typography sx={{ fontWeight: 700 }} noWrap>
									{user.name}
								</Typography>
								<Typography
									variant='caption'
									sx={{ color: "text.secondary" }}
									noWrap
								>
									{user.email}
								</Typography>
							</Box>
						</Stack>
						<Button
							variant='outlined'
							color='error'
							fullWidth
							startIcon={<LogoutRoundedIcon />}
							onClick={() => {
								onClose();
								void signOut({ callbackUrl: "/" });
							}}
						>
							تسجيل الخروج
						</Button>
					</Stack>
				</Box>
			) : null}
		</Drawer>
	);
}
