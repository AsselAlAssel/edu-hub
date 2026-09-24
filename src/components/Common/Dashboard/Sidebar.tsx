"use client";

import Logo from "@/components/AppShell/Logo";
import { isNavItemActive, NAV_ITEMS } from "@/constants/navigation";
import { Role } from "@/types/enums";
import type { LandingSectionId } from "@/types/landingNav";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
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
			fontWeight: 700,
			fontSize: "1.0625rem",
			textDecoration: "none",
			color: active ? theme.palette.primary.main : theme.palette.text.primary,
			backgroundColor: active
				? alpha(theme.palette.primary.main, 0.1)
				: "transparent",
			"&:hover": { backgroundColor: theme.palette.action.hover },
		});

	return (
		<Drawer
			open={showSideBar}
			// MUI mirrors horizontal anchors under RTL: "left" opens from the right (start) edge.
			anchor='left'
			onClose={onClose}
			PaperProps={{
				sx: {
					width: "min(360px, 100%)",
					display: "flex",
					flexDirection: "column",
				},
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
							<li key={item.href}>
								<Box
									component={Link}
									href={item.href}
									onClick={onClose}
									aria-current={active ? "page" : undefined}
									sx={linkSx(active)}
								>
									{item.label}
								</Box>
							</li>
						);
					})}
					{isAdmin ? (
						<li>
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
						</li>
					) : null}
				</Stack>
			</Box>

			<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
				{user ? (
					<Stack spacing={2}>
						<Stack direction='row' alignItems='center' gap={1.5}>
							<Avatar sx={{ width: 40, height: 40 }}>
								{user.name?.charAt(0)?.toUpperCase() || "م"}
							</Avatar>
							<Box sx={{ minWidth: 0 }}>
								<Typography sx={{ fontWeight: 800 }} noWrap>
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
				) : (
					<Button
						component={Link}
						href='/auth/signin'
						variant='outlined'
						fullWidth
						startIcon={<LoginRoundedIcon />}
						onClick={onClose}
					>
						تسجيل الدخول
					</Button>
				)}
			</Box>
		</Drawer>
	);
}
