"use client";

import {
	alpha,
	Box,
	Button,
	Divider,
	Drawer,
	Stack,
	Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { APP_BAR_HEIGHT } from "@/constants/appShell";
import type { LandingSectionId } from "@/types/landingNav";
import { Role } from "@/types/enums";

type SideBarProps = {
	showSideBar: boolean;
	onClose: () => void;
	login: () => void;
	landingActiveSection?: LandingSectionId;
};

const LinkItem = ({
	children,
	href,
	onClick,
	isActive,
}: {
	children: React.ReactNode;
	href: string;
	onClick?: () => void;
	isActive?: boolean;
}) => {
	return (
		<Typography
			component='span'
			sx={{
				fontWeight: 600,
				fontSize: "1.0625rem",
				color: isActive ? "primary.main" : "text.tertiary",
				width: "100%",
				py: 1.5,
				px: 2,
				borderRadius: 1.5,
				transition: "all 0.2s ease",
				backgroundColor: isActive
					? (theme) => alpha(theme.palette.primary.main, 0.06)
					: "transparent",
				"&:active": {
					backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
				},
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
	const { showSideBar, onClose, landingActiveSection } = props;
	const { data } = useSession();
	const user = data?.user;
	const isAdmin = user?.role === Role.ADMIN;
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Drawer
			open={showSideBar}
			anchor='right'
			onClose={onClose}
			transitionDuration={{
				appear: 300,
				enter: 300,
				exit: 250,
			}}
			sx={{
				zIndex: 99,
			}}
			PaperProps={{
				sx: {
					width: "100%",
					pt: `${APP_BAR_HEIGHT}px`,
					backgroundColor: "background.paper",
				},
			}}
		>
			<Box
				height={`calc(100svh - ${APP_BAR_HEIGHT}px)`}
				m={2}
				role='navigation'
				aria-label='القائمة الجانبية'
			>
				<Stack height={"100%"} flex={1} justifyContent={"space-between"}>
					<Stack spacing={1} mt={user ? 2 : 0}>
						<LinkItem
							href='/#home'
							onClick={onClose}
							isActive={
								pathname === "/" && landingActiveSection === "home"
							}
						>
							الرئيسية
						</LinkItem>
						<LinkItem
							href='/classes'
							onClick={onClose}
							isActive={pathname === "/classes"}
						>
							الصفوف
						</LinkItem>
						<LinkItem
							href='/#about'
							onClick={onClose}
							isActive={
								pathname === "/" && landingActiveSection === "about"
							}
						>
							عن هذه المنصة
						</LinkItem>
						<LinkItem
							href='/#contact'
							onClick={onClose}
							isActive={
								pathname === "/" && landingActiveSection === "contact"
							}
						>
							اتصل بنا
						</LinkItem>
						{isAdmin ? (
							<>
								<Box px={2} py={1}>
									<Divider />
								</Box>
								<LinkItem
									href='/admin/profile'
									onClick={onClose}
									isActive={pathname.startsWith("/admin")}
								>
									لوحة التحكم
								</LinkItem>
							</>
						) : null}
					</Stack>
					<Stack spacing={1.5} pb={4}>
						{user ? (
							<Button
								onClick={async () => {
									await signOut();
									router.push("/");
								}}
								variant={"outlined"}
								color='error'
								fullWidth
							>
								تسجيل الخروج
							</Button>
						) : null}
					</Stack>
				</Stack>
			</Box>
		</Drawer>
	);
}
