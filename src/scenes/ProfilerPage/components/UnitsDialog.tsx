"use client";
import AppDialog from "@/components/ui/AppDialog";
import { SecondaryButton } from "@/components/ui/buttons";
import { EmptyState, ErrorState } from "@/components/ui/States";
import type { PaidUnitGroup } from "@/libs/access";
import { getErrorMessage } from "@/libs/errors";
import type { PublicUser } from "@/libs/users";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Admin: tick the paid units a student has paid for (outside the site).
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

	const toggle = (id: string) =>
		setChecked((current) => {
			const next = new Set(current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const save = async () => {
		if (!user || !groups) return;
		// Only units still on sale: a unit made free since drops out of the list.
		const onSale = groups.flatMap((group) =>
			group.units.map((unit) => unit.id)
		);
		setBusy(true);
		try {
			await axios.put(`/api/user/${user.id}/units`, {
				unitIds: onSale.filter((id) => checked.has(id)),
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
					<Skeleton key={index} variant='rounded' height={36} />
				))}
			</Stack>
		);
	} else if (!groups.length) {
		content = (
			<EmptyState
				compact
				icon={<SellOutlinedIcon />}
				title='لا توجد وحدات مدفوعة بعد'
				description='حدّد سعر الوحدة من قائمة المجلد داخل الصف.'
			/>
		);
	} else {
		content = (
			<Stack spacing={2.5}>
				{groups.map((group) => (
					<FormGroup key={group.classId}>
						<Typography sx={{ fontWeight: 700, mb: 0.5 }}>
							{group.className}
						</Typography>
						{group.units.map((unit) => (
							<FormControlLabel
								key={unit.id}
								control={
									<Checkbox
										checked={checked.has(unit.id)}
										onChange={() => toggle(unit.id)}
									/>
								}
								label={`${unit.name} — ${unit.price} ₪`}
							/>
						))}
					</FormGroup>
				))}
			</Stack>
		);
	}

	return (
		<AppDialog
			open={!!user}
			onClose={onClose}
			busy={busy}
			title={`وحدات ${user?.name || user?.email || ""}`}
			description='علّم الوحدات التي دفع الطالب ثمنها. تُفتح أو تُغلق فوراً.'
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						variant='contained'
						loading={busy}
						disabled={!groups?.length}
						onClick={() => void save()}
					>
						حفظ
					</LoadingButton>
				</>
			}
		>
			{content}
		</AppDialog>
	);
}
