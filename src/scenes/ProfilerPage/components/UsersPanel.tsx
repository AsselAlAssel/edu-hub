"use client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SearchField } from "@/components/ui/FormField";
import IconTile from "@/components/ui/IconTile";
import { ErrorState, EmptyState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { getErrorMessage } from "@/libs/errors";
import type { PaidUnitGroup } from "@/libs/access";
import type { PublicUser, RoleName } from "@/libs/users";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import {
	Avatar,
	Box,
	Button,
	Chip,
	IconButton,
	MenuItem,
	Pagination,
	Select,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import {
	filterUsers,
	roleOf,
	unitCount,
	userStats,
	type UserFilters,
} from "../usersFilter";
import UnitsDialog from "./UnitsDialog";

const USERS_KEY = "/api/user";
const fetchUsers = (url: string) =>
	axios.get<PublicUser[]>(url).then((res) => res.data);

const ROLE_LABELS: Record<RoleName, string> = { ADMIN: "مشرف", USER: "مستخدم" };
const PAGE_SIZE = 10;
const DEFAULT_FILTERS: UserFilters = {
	query: "",
	role: "ALL",
	joined: "ALL",
	sort: "newest",
	subscription: "ALL",
};
const UNITS_KEY = "/api/units";
const fetchUnits = (url: string) =>
	axios.get<PaidUnitGroup[]>(url).then((res) => res.data);
const dateFormat = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const monthFormat = new Intl.DateTimeFormat("ar", { month: "short" });

function StatTile({
	icon,
	label,
	value,
	tone,
}: {
	icon: ReactNode;
	label: string;
	value: number;
	tone: "primary" | "secondary" | "success" | "info";
}) {
	return (
		<Surface sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
			<IconTile tone={tone} size={44}>
				{icon}
			</IconTile>
			<Box sx={{ minWidth: 0 }}>
				<Typography variant='h5' sx={{ fontWeight: 800, lineHeight: 1.1 }}>
					{value.toLocaleString("ar")}
				</Typography>
				<Typography variant='body2' sx={{ color: "text.secondary" }} noWrap>
					{label}
				</Typography>
			</Box>
		</Surface>
	);
}

function SignupsChart({
	monthly,
}: {
	monthly: { start: Date; count: number }[];
}) {
	const max = Math.max(1, ...monthly.map((month) => month.count));
	return (
		<Surface sx={{ p: 2 }}>
			<Typography sx={{ fontWeight: 700, mb: 1.5 }}>
				التسجيلات آخر {monthly.length} أشهر
			</Typography>
			<Stack
				direction='row'
				alignItems='flex-end'
				gap={1.5}
				sx={{ height: 120 }}
				role='img'
				aria-label={monthly
					.map((month) => `${monthFormat.format(month.start)}: ${month.count}`)
					.join("، ")}
			>
				{monthly.map((month) => (
					<Stack
						key={month.start.toISOString()}
						alignItems='center'
						justifyContent='flex-end'
						sx={{ flex: 1, height: "100%", minWidth: 0 }}
					>
						<Typography variant='caption' sx={{ fontWeight: 700 }}>
							{month.count}
						</Typography>
						<Box
							sx={{
								width: "100%",
								maxWidth: 40,
								height: `${(month.count / max) * 70}%`,
								minHeight: 4,
								borderRadius: 1,
								bgcolor: "primary.main",
							}}
						/>
						<Typography
							variant='caption'
							sx={{ color: "text.secondary", mt: 0.5 }}
							noWrap
						>
							{monthFormat.format(month.start)}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Surface>
	);
}

/** Admin user management: stats, filters, paging, role changes and deletion (never yourself). */
export default function UsersPanel() {
	const { data: session } = useSession();
	const myId = session?.user?.id;
	const { data, error, isLoading, mutate } = useSWR(USERS_KEY, fetchUsers);
	const [filters, setFilters] = useState(DEFAULT_FILTERS);
	const [page, setPage] = useState(1);
	const [toDelete, setToDelete] = useState<PublicUser | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [unitsFor, setUnitsFor] = useState<PublicUser | null>(null);
	const { data: unitGroups, error: unitsError } = useSWR(UNITS_KEY, fetchUnits);
	// "الحادي عشر: الوحدة 1" by unit id, for the chips on each student.
	const unitLabels = useMemo(
		() =>
			new Map(
				(unitGroups ?? []).flatMap((group) =>
					group.units.map(
						(unit) => [unit.id, `${group.className}: ${unit.name}`] as const
					)
				)
			),
		[unitGroups]
	);

	// ponytail: filters/pages client-side over the full list; move to
	// server-side paging (skip/take) if users grow into the tens of thousands.
	const users = useMemo(
		() => filterUsers(data ?? [], filters),
		[data, filters]
	);
	const stats = useMemo(() => userStats(data ?? []), [data]);
	const pageCount = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const pageUsers = users.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	);
	const isFiltered =
		JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

	const setFilter = <K extends keyof UserFilters>(
		key: K,
		value: UserFilters[K]
	) => {
		setFilters((current) => ({ ...current, [key]: value }));
		setPage(1);
	};

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
			{data ? (
				<>
					<Box
						sx={{
							display: "grid",
							gap: 1.5,
							gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
						}}
					>
						<StatTile
							icon={<GroupOutlinedIcon />}
							label='كل المستخدمين'
							value={stats.total}
							tone='primary'
						/>
						<StatTile
							icon={<SchoolOutlinedIcon />}
							label='الطلاب'
							value={stats.students}
							tone='info'
						/>
						<StatTile
							icon={<AdminPanelSettingsOutlinedIcon />}
							label='المشرفون'
							value={stats.admins}
							tone='secondary'
						/>
						<StatTile
							icon={<PersonAddAltOutlinedIcon />}
							label='جدد آخر 30 يوم'
							value={stats.newLast30}
							tone='success'
						/>
					</Box>
					<SignupsChart monthly={stats.monthly} />
				</>
			) : null}

			<Stack direction={{ xs: "column", md: "row" }} gap={1.5}>
				<SearchField
					label='ابحث بالاسم أو البريد الإلكتروني'
					value={filters.query}
					onChange={(event) => setFilter("query", event.target.value)}
				/>
				<Stack direction='row' gap={1.5} sx={{ flexShrink: 0 }}>
					<Select
						size='small'
						value={filters.role}
						onChange={(event) =>
							setFilter("role", event.target.value as UserFilters["role"])
						}
						inputProps={{ "aria-label": "تصفية حسب الصلاحية" }}
						sx={{ flex: 1, minWidth: 110 }}
					>
						<MenuItem value='ALL'>كل الصلاحيات</MenuItem>
						<MenuItem value='USER'>الطلاب</MenuItem>
						<MenuItem value='ADMIN'>المشرفون</MenuItem>
					</Select>
					<Select
						size='small'
						value={filters.joined}
						onChange={(event) =>
							setFilter("joined", event.target.value as UserFilters["joined"])
						}
						inputProps={{ "aria-label": "تصفية حسب تاريخ التسجيل" }}
						sx={{ flex: 1, minWidth: 110 }}
					>
						<MenuItem value='ALL'>كل الأوقات</MenuItem>
						<MenuItem value='7'>آخر 7 أيام</MenuItem>
						<MenuItem value='30'>آخر 30 يوم</MenuItem>
					</Select>
					<Select
						size='small'
						value={filters.sort}
						onChange={(event) =>
							setFilter("sort", event.target.value as UserFilters["sort"])
						}
						inputProps={{ "aria-label": "الترتيب" }}
						sx={{ flex: 1, minWidth: 100 }}
					>
						<MenuItem value='newest'>الأحدث</MenuItem>
						<MenuItem value='oldest'>الأقدم</MenuItem>
						<MenuItem value='name'>الاسم</MenuItem>
					</Select>
					<Select
						size='small'
						value={filters.subscription}
						onChange={(event) =>
							setFilter(
								"subscription",
								event.target.value as UserFilters["subscription"]
							)
						}
						inputProps={{ "aria-label": "تصفية حسب الاشتراك" }}
						sx={{ flex: 1, minWidth: 120 }}
					>
						<MenuItem value='ALL'>كل الطلاب</MenuItem>
						<MenuItem value='PAID'>المشتركون فقط</MenuItem>
					</Select>
				</Stack>
			</Stack>

			{data ? (
				<Stack direction='row' alignItems='center' gap={1}>
					<Typography
						variant='body2'
						sx={{ color: "text.secondary" }}
						aria-live='polite'
					>
						{users.length === 0
							? "لا نتائج"
							: `عرض ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, users.length)} من ${users.length}`}
					</Typography>
					{isFiltered ? (
						<Button
							size='small'
							onClick={() => {
								setFilters(DEFAULT_FILTERS);
								setPage(1);
							}}
						>
							مسح الفلاتر
						</Button>
					) : null}
				</Stack>
			) : null}

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
					title={isFiltered ? "لا توجد نتائج مطابقة" : "لا يوجد مستخدمون"}
				/>
			) : (
				<Stack
					component='ul'
					spacing={1.5}
					sx={{ listStyle: "none", m: 0, p: 0 }}
					aria-label='المستخدمون'
				>
					{pageUsers.map((user) => {
						const isMe = user.id === myId;
						const role = roleOf(user);
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
									<Avatar
										src={user.image || undefined}
										alt={user.name || ""}
										// Google avatars 403 when a referrer is sent.
										imgProps={{ referrerPolicy: "no-referrer" }}
									>
										{user.name?.charAt(0)?.toUpperCase() || "؟"}
									</Avatar>
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
										<Typography
											variant='caption'
											sx={{ color: "text.secondary" }}
										>
											انضم {dateFormat.format(new Date(user.createdAt))}
										</Typography>
										{unitCount(user) ? (
											<Stack
												direction='row'
												flexWrap='wrap'
												gap={0.5}
												sx={{ mt: 0.75 }}
											>
												{(user.unlockedUnitIds ?? []).map((id) =>
													unitLabels.has(id) ? (
														<Chip
															key={id}
															size='small'
															color='success'
															variant='outlined'
															label={unitLabels.get(id)}
														/>
													) : null
												)}
											</Stack>
										) : null}
									</Box>
								</Stack>
								<Stack direction='row' alignItems='center' gap={1}>
									<Button
										size='small'
										variant={unitCount(user) ? "contained" : "outlined"}
										color={unitCount(user) ? "success" : "primary"}
										startIcon={<SellOutlinedIcon />}
										onClick={() => setUnitsFor(user)}
										aria-label={`وحدات ${user.name || user.email}`}
									>
										{unitCount(user)
											? `الوحدات (${unitCount(user)})`
											: "فتح وحدات"}
									</Button>
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

			{pageCount > 1 ? (
				<Pagination
					count={pageCount}
					page={currentPage}
					onChange={(_, value) => setPage(value)}
					color='primary'
					sx={{ alignSelf: "center" }}
				/>
			) : null}

			<ConfirmDialog
				open={!!toDelete}
				title='حذف المستخدم'
				description={`سيتم حذف حساب «${toDelete?.name || toDelete?.email}» نهائياً.`}
				confirmLabel='حذف المستخدم'
				loading={!!toDelete && busyId === toDelete.id}
				onClose={() => setToDelete(null)}
				onConfirm={deleteUser}
			/>
			<UnitsDialog
				user={unitsFor}
				groups={unitGroups}
				error={unitsError}
				onClose={() => setUnitsFor(null)}
				onSaved={() => void mutate()}
			/>
		</Stack>
	);
}
