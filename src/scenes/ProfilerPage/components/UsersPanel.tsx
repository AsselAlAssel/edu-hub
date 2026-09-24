"use client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SearchField } from "@/components/ui/FormField";
import { ErrorState, EmptyState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { getErrorMessage } from "@/libs/errors";
import type { PublicUser, RoleName } from "@/libs/users";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import {
	Avatar,
	Box,
	Button,
	Chip,
	IconButton,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

const USERS_KEY = "/api/user";
const fetchUsers = (url: string) =>
	axios.get<PublicUser[]>(url).then((res) => res.data);

const ROLE_LABELS: Record<RoleName, string> = { ADMIN: "مشرف", USER: "مستخدم" };

/** Admin user management: search, role changes and deletion (never yourself). */
export default function UsersPanel() {
	const { data: session } = useSession();
	const myId = session?.user?.id;
	const { data, error, isLoading, mutate } = useSWR(USERS_KEY, fetchUsers);
	const [query, setQuery] = useState("");
	const [toDelete, setToDelete] = useState<PublicUser | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);

	const users = useMemo(() => {
		const q = query.trim().toLowerCase();
		return (data ?? []).filter(
			(user) =>
				!q ||
				user.email?.toLowerCase().includes(q) ||
				user.name?.toLowerCase().includes(q)
		);
	}, [data, query]);

	const changeRole = async (user: PublicUser, role: RoleName) => {
		setBusyId(user.id);
		try {
			await mutate(
				axios
					.patch(USERS_KEY, { id: user.id, role })
					.then(() => undefined as unknown as PublicUser[]),
				{
					optimisticData: (current = []) =>
						current.map((item) =>
							item.id === user.id ? { ...item, role } : item
						),
					rollbackOnError: true,
					populateCache: false,
					revalidate: true,
				}
			);
			toast.success("تم تحديث الصلاحية");
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر تحديث الصلاحية"));
		} finally {
			setBusyId(null);
		}
	};

	const deleteUser = async () => {
		if (!toDelete) return;
		const target = toDelete;
		setBusyId(target.id);
		try {
			await axios.delete(USERS_KEY, { data: { id: target.id } });
			await mutate();
			toast.success("تم حذف المستخدم");
			setToDelete(null);
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حذف المستخدم"));
		} finally {
			setBusyId(null);
		}
	};

	if (error && !data) {
		return (
			<ErrorState
				title='تعذّر تحميل المستخدمين'
				action={
					<Button variant='outlined' onClick={() => void mutate()}>
						إعادة المحاولة
					</Button>
				}
			/>
		);
	}

	return (
		<Stack spacing={2.5}>
			<SearchField
				label='ابحث بالاسم أو البريد الإلكتروني'
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>

			{isLoading ? (
				<Stack spacing={1.5} aria-hidden>
					{[0, 1, 2].map((index) => (
						<Skeleton key={index} variant='rounded' height={76} />
					))}
				</Stack>
			) : users.length === 0 ? (
				<EmptyState
					compact
					icon={<GroupOutlinedIcon />}
					title={query ? "لا توجد نتائج مطابقة" : "لا يوجد مستخدمون"}
				/>
			) : (
				<Stack
					component='ul'
					spacing={1.5}
					sx={{ listStyle: "none", m: 0, p: 0 }}
					aria-label='المستخدمون'
				>
					{users.map((user) => {
						const isMe = user.id === myId;
						const role = (user.role === "ADMIN" ? "ADMIN" : "USER") as RoleName;
						return (
							<Surface
								key={user.id}
								component='li'
								sx={{
									p: 2,
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									alignItems: { xs: "stretch", sm: "center" },
									gap: 2,
								}}
							>
								<Stack
									direction='row'
									alignItems='center'
									gap={1.5}
									sx={{ flex: 1, minWidth: 0 }}
								>
									<Avatar>{user.name?.charAt(0)?.toUpperCase() || "؟"}</Avatar>
									<Box sx={{ minWidth: 0 }}>
										<Stack direction='row' alignItems='center' gap={1}>
											<Typography sx={{ fontWeight: 700 }} noWrap>
												{user.name || "بدون اسم"}
											</Typography>
											{isMe ? (
												<Chip size='small' color='primary' label='أنت' />
											) : null}
										</Stack>
										<Typography
											variant='body2'
											sx={{ color: "text.secondary" }}
											noWrap
											dir='ltr'
											textAlign='end'
										>
											{user.email}
										</Typography>
									</Box>
								</Stack>
								<Stack direction='row' alignItems='center' gap={1}>
									<Select
										size='small'
										value={role}
										disabled={isMe || busyId === user.id}
										onChange={(event) =>
											void changeRole(user, event.target.value as RoleName)
										}
										inputProps={{
											"aria-label": `صلاحية ${user.name || user.email}`,
										}}
										sx={{ minWidth: 130 }}
									>
										{(Object.keys(ROLE_LABELS) as RoleName[]).map((value) => (
											<MenuItem key={value} value={value}>
												{ROLE_LABELS[value]}
											</MenuItem>
										))}
									</Select>
									<Tooltip title={isMe ? "لا يمكنك حذف حسابك" : "حذف المستخدم"}>
										<span>
											<IconButton
												aria-label={`حذف ${user.name || user.email}`}
												disabled={isMe || busyId === user.id}
												onClick={() => setToDelete(user)}
												sx={{ color: "error.main" }}
											>
												<DeleteOutlineRoundedIcon />
											</IconButton>
										</span>
									</Tooltip>
								</Stack>
							</Surface>
						);
					})}
				</Stack>
			)}

			<ConfirmDialog
				open={!!toDelete}
				title='حذف المستخدم'
				description={`سيتم حذف حساب «${toDelete?.name || toDelete?.email}» نهائياً.`}
				confirmLabel='حذف المستخدم'
				loading={!!toDelete && busyId === toDelete.id}
				onClose={() => setToDelete(null)}
				onConfirm={deleteUser}
			/>
		</Stack>
	);
}
