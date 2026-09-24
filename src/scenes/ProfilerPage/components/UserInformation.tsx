"use client";
import Surface from "@/components/ui/Surface";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserInformation() {
	const { data } = useSession();
	const user = data?.user;

	return (
		<Surface component='aside' aria-label='معلومات الحساب' sx={{ p: 3 }}>
			<Stack direction='row' alignItems='center' gap={1.5}>
				<Avatar sx={{ width: 52, height: 52, fontSize: "1.25rem" }}>
					{user?.name?.charAt(0)?.toUpperCase() || "م"}
				</Avatar>
				<Box sx={{ minWidth: 0 }}>
					<Typography sx={{ fontWeight: 800 }} noWrap>
						{user?.name}
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: "text.secondary" }}
						noWrap
						dir='ltr'
						textAlign='end'
					>
						{user?.email}
					</Typography>
				</Box>
			</Stack>
			<Chip
				icon={<AdminPanelSettingsOutlinedIcon />}
				label='مشرف المنصة'
				color='primary'
				variant='outlined'
				sx={{ mt: 2 }}
			/>
			<Divider sx={{ my: 2.5 }} />
			<Stack spacing={1}>
				<Button
					component={Link}
					href='/'
					variant='outlined'
					endIcon={<OpenInNewRoundedIcon />}
					fullWidth
				>
					عرض الصفحة الرئيسية
				</Button>
				<Button component={Link} href='/classes' variant='text' fullWidth>
					إدارة الصفوف والمحتوى
				</Button>
			</Stack>
		</Surface>
	);
}
