"use client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SearchField } from "@/components/ui/FormField";
import StatTile from "@/components/ui/StatTile";
import { ErrorState, EmptyState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { useUsers, useUserStats } from "@/hooks/useUsersApi";
import { getErrorMessage } from "@/libs/errors";
import type { PaidUnitGroup } from "@/libs/access";
import {
	DEFAULT_USER_FILTERS,
	USERS_PAGE_SIZE,
	type UserFilters,
} from "@/libs/userQuery";
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
	LinearProgress,
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
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { roleOf, unitCount } from "../usersFilter";
import UnitsDialog from "./UnitsDialog";

const ROLE_LABELS: Record<RoleName, string> = { ADMIN: "مشرف", USER: "مستخدم" };
const UNITS_KEY = "/api/units";
const fetchUnits = (url: string) =>
	axios.get<PaidUnitGroup[]>(url).then((res) => res.data);
const dateFormat = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const monthFormat = new Intl.DateTimeFormat("ar", { month: "short" });

function SignupsChart({
	monthly,
}: {
	// Dates arrive as ISO strings over JSON.
	monthly: { start: Date | string; count: number }[];
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
					.map(
						(month) =>
							`${monthFormat.format(new Date(month.start))}: ${month.count}`
					)
					.join("، ")}
			>
				{monthly.map((month) => (
					<Stack
						key={String(month.start)}
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
							{monthFormat.format(new Date(month.start))}
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
	const [filters, setFilters] = useState(DEFAULT_USER_FILTERS);
	const [page, setPage] = useState(1);
	const {
		data,
		error,
		isLoading,
		isFetching,
		changeRole,
		deleteUser,
		refresh,
	} = useUsers(filters, page);
	const { data: stats } = useUserStats();
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

	const users = data?.users ?? [];
	const total = data?.total ?? 0;
	// The server returns the last page when the requested one is past the end.
	const currentPage = data?.page ?? page;
	const pageCount = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
	const firstShown = (currentPage - 1) * USERS_PAGE_SIZE + 1;
	const isFiltered =
		JSON.stringify(filters) !== JSON.stringify(DEFAULT_USER_FILTERS);

	const setFilter = <K extends keyof UserFilters>(
		key: K,
		value: UserFilters[K]
	) => {
		setFilters((current) => ({ ...current, [key]: value }));
		setPage(1);
	};

	const updateRole = async (user: PublicUser, role: RoleName) => {
		setBusyId(user.id);
		try {
			await changeRole(user.id, role);
			toast.success("تم تحديث الصلاحية");
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر تحديث الصلاحية"));
		} finally {
			setBusyId(null);
		}
	};

	const confirmDelete = async () => {
		if (!toDelete) return;
		const target = toDelete;
		setBusyId(target.id);
		try {
			await deleteUser(target.id);
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
					<Button variant='outlined' onClick={() => void refresh()}>
						إعادة المحاولة
					</Button>
				}
			/>
		);
	}

	return (
		<Stack spacing={2.5}>
			{stats ? (
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
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(2, minmax(0, 1fr))",
							md: "repeat(4, auto)",
						},
						gap: 1.5,
						flexShrink: 0,
					}}
				>
					<Select
						size='small'
						value={filters.role}
						onChange={(event) =>
							setFilter("role", event.target.value as UserFilters["role"])
						}
						inputProps={{ "aria-label": "تصفية حسب الصلاحية" }}
						sx={{ minWidth: { md: 110 } }}
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
						sx={{ minWidth: { md: 110 } }}
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
						sx={{ minWidth: { md: 100 } }}
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
						sx={{ minWidth: { md: 120 } }}
					>
						<MenuItem value='ALL'>كل الطلاب</MenuItem>
						<MenuItem value='PAID'>المشتركون فقط</MenuItem>
					</Select>
				</Box>
			</Stack>

			{data ? (
				<Stack direction='row' alignItems='center' gap={1}>
					<Typography
						variant='body2'
						sx={{ color: "text.secondary" }}
						aria-live='polite'
					>
						{total === 0
							? "لا نتائج"
							: `عرض ${firstShown}–${firstShown + users.length - 1} من ${total}`}
					</Typography>
					{isFiltered ? (
						<Button
							size='small'
							onClick={() => {
								setFilters(DEFAULT_USER_FILTERS);
								setPage(1);
							}}
						>
							مسح الفلاتر
						</Button>
					) : null}
				</Stack>
			) : null}

			{data && isFetching ? (
				<LinearProgress aria-label='جارٍ تحميل المستخدمين' />
			) : null}

			{!data && isLoading ? (
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
					aria-label='المستخدمون'
					aria-busy={isFetching}
					// The previous page stays, dimmed, until the next one arrives.
					sx={{
						listStyle: "none",
						m: 0,
						p: 0,
						opacity: isFetching ? 0.55 : 1,
						transition: "opacity 150ms",
					}}
				>
					{users.map((user) => {
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
										{unitCount(user, unitLabels) ? (
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
										variant={
											unitCount(user, unitLabels) ? "contained" : "outlined"
										}
										color={unitCount(user, unitLabels) ? "success" : "primary"}
										startIcon={<SellOutlinedIcon />}
										onClick={() => setUnitsFor(user)}
										aria-label={`وحدات ${user.name || user.email}`}
									>
										{unitCount(user, unitLabels)
											? `الوحدات (${unitCount(user, unitLabels)})`
											: "فتح وحدات"}
									</Button>
									<Select
										size='small'
										value={role}
										disabled={isMe || busyId === user.id}
										onChange={(event) =>
											void updateRole(user, event.target.value as RoleName)
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
				onConfirm={confirmDelete}
			/>
			<UnitsDialog
				user={unitsFor}
				groups={unitGroups}
				error={unitsError}
				onClose={() => setUnitsFor(null)}
				onSaved={() => void refresh()}
			/>
		</Stack>
	);
}
