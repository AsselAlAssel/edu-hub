"use client";
import AppDialog from "@/components/ui/AppDialog";
import { SecondaryButton } from "@/components/ui/buttons";
import { EmptyState, ErrorState } from "@/components/ui/States";
import type { PaidUnitGroup } from "@/libs/access";
import { getErrorMessage } from "@/libs/errors";
import type { PublicUser } from "@/libs/users";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Avatar,
	Box,
	Button,
	ButtonBase,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type UnitRowProps = {
	name: string;
	price: number | null;
	selected: boolean;
	onToggle: () => void;
};

/** A whole-row toggle: lock when closed, green check when the student has it. */
function UnitRow({ name, price, selected, onToggle }: UnitRowProps) {
	return (
		<ButtonBase
			role='checkbox'
			aria-checked={selected}
			aria-label={`${name} — ${price} ₪`}
			onClick={onToggle}
			sx={(theme) => ({
				width: "100%",
				justifyContent: "space-between",
				gap: 1.5,
				px: 1.75,
				py: 1.25,
				borderRadius: `${theme.tokens.radii.md}px`,
				border: `1px solid ${
					selected ? theme.palette.success.main : theme.tokens.colors.border
				}`,
				backgroundColor: selected
					? alpha(theme.palette.success.main, 0.08)
					: "transparent",
				transition: theme.transitions.create([
					"background-color",
					"border-color",
				]),
				"&:hover": {
					backgroundColor: selected
						? alpha(theme.palette.success.main, 0.14)
						: theme.tokens.colors.surfaceSecondary,
				},
				"&.Mui-focusVisible": {
					outline: `2px solid ${theme.palette.primary.main}`,
					outlineOffset: 2,
				},
			})}
		>
			<Stack direction='row' alignItems='center' gap={1.25} minWidth={0}>
				{selected ? (
					<CheckCircleRoundedIcon color='success' />
				) : (
					<LockOutlinedIcon sx={{ color: "text.disabled" }} />
				)}
				<Typography sx={{ fontWeight: 600, textAlign: "start" }} noWrap>
					{name}
				</Typography>
			</Stack>
			<Typography
				sx={{
					fontWeight: 700,
					color: selected ? "success.main" : "text.secondary",
					flexShrink: 0,
				}}
			>
				{price} ₪
			</Typography>
		</ButtonBase>
	);
}

/**
 * Admin: pick the paid units a student has paid for (outside the site).
 * Saving replaces the student's whole list; access changes immediately.
 */
export default function UnitsDialog({
	user,
	groups,
	error,
	onClose,
	onSaved,
}: {
	user: PublicUser | null;
	/** Units on sale, from /api/units (undefined while loading). */
	groups: PaidUnitGroup[] | undefined;
	error: unknown;
	onClose: () => void;
	onSaved: () => void;
}) {
	const [checked, setChecked] = useState<Set<string>>(new Set());
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (user) setChecked(new Set(user.unlockedUnitIds ?? []));
	}, [user]);

	const units = useMemo(
		() => (groups ?? []).flatMap((group) => group.units),
		[groups]
	);
	const selected = units.filter((unit) => checked.has(unit.id));
	const total = selected.reduce((sum, unit) => sum + (unit.price ?? 0), 0);

	const setMany = (ids: string[], on: boolean) =>
		setChecked((current) => {
			const next = new Set(current);
			for (const id of ids) {
				if (on) next.add(id);
				else next.delete(id);
			}
			return next;
		});

	const save = async () => {
		if (!user || !groups) return;
		setBusy(true);
		try {
			// Only units still on sale: a unit made free since drops out of the list.
			await axios.put(`/api/user/${user.id}/units`, {
				unitIds: selected.map((unit) => unit.id),
			});
			toast.success("تم تحديث وحدات الطالب");
			onSaved();
			onClose();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حفظ الوحدات"));
		} finally {
			setBusy(false);
		}
	};

	let content;
	if (error && !groups) {
		content = <ErrorState title='تعذّر تحميل الوحدات' />;
	} else if (!groups) {
		content = (
			<Stack spacing={1} aria-hidden>
				{[0, 1, 2].map((index) => (
					<Skeleton key={index} variant='rounded' height={48} />
				))}
			</Stack>
		);
	} else if (!groups.length) {
		content = (
			<EmptyState
				compact
				icon={<SellOutlinedIcon />}
				title='لا توجد وحدات مدفوعة بعد'
				description='أضف سعراً لوحدة عند إنشائها داخل الصف، أو من قائمة ⋯ على الوحدة.'
			/>
		);
	} else {
		content = (
			<Stack spacing={2.5}>
				{groups.map((group) => {
					const ids = group.units.map((unit) => unit.id);
					const allOn = ids.every((id) => checked.has(id));
					return (
						<Box key={group.classId} component='section'>
							<Stack
								direction='row'
								alignItems='center'
								justifyContent='space-between'
								sx={{ mb: 1 }}
							>
								<Typography component='h3' sx={{ fontWeight: 800 }}>
									{group.className}
								</Typography>
								<Button size='small' onClick={() => setMany(ids, !allOn)}>
									{allOn ? "إلغاء الكل" : "تحديد الكل"}
								</Button>
							</Stack>
							<Stack spacing={1}>
								{group.units.map((unit) => (
									<UnitRow
										key={unit.id}
										name={unit.name}
										price={unit.price}
										selected={checked.has(unit.id)}
										onToggle={() => setMany([unit.id], !checked.has(unit.id))}
									/>
								))}
							</Stack>
						</Box>
					);
				})}
			</Stack>
		);
	}

	const title = (
		<Stack direction='row' alignItems='center' gap={1.25}>
			<Avatar
				src={user?.image || undefined}
				alt=''
				imgProps={{ referrerPolicy: "no-referrer" }}
				sx={{ width: 36, height: 36 }}
			>
				{user?.name?.charAt(0)?.toUpperCase() || "؟"}
			</Avatar>
			<Box sx={{ minWidth: 0 }}>
				<Typography sx={{ fontWeight: 800 }} noWrap>
					وحدات {user?.name || "الطالب"}
				</Typography>
				<Typography
					variant='caption'
					sx={{ color: "text.secondary" }}
					dir='ltr'
					component='p'
					textAlign='end'
				>
					{user?.email}
				</Typography>
			</Box>
		</Stack>
	);

	return (
		<AppDialog
			open={!!user}
			onClose={onClose}
			busy={busy}
			maxWidth='sm'
			title={title}
			description='اختر الوحدات التي دفع الطالب ثمنها. تُفتح له أو تُغلق فور الحفظ.'
			actions={
				<Stack
					direction='row'
					alignItems='center'
					gap={1}
					sx={{ width: "100%" }}
				>
					<Typography
						variant='body2'
						sx={{ flex: 1, color: "text.secondary" }}
						aria-live='polite'
					>
						{selected.length
							? `${selected.length} ${selected.length === 1 ? "وحدة" : "وحدات"} · ${total} ₪`
							: "لا وحدات مفتوحة"}
					</Typography>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						variant='contained'
						loading={busy}
						disabled={!groups}
						onClick={() => void save()}
					>
						حفظ
					</LoadingButton>
				</Stack>
			}
		>
			{content}
		</AppDialog>
	);
}
