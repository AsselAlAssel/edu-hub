"use client";
import AppDialog from "@/components/ui/AppDialog";
import { SecondaryButton } from "@/components/ui/buttons";
import { FormField } from "@/components/ui/FormField";
import { getErrorMessage } from "@/libs/errors";
import LoadingButton from "@mui/lab/LoadingButton";
import type { Folder } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/** Admin: sets (or clears, when empty) the price that makes a folder a paid unit. */
export default function PriceDialog({
	folder,
	onClose,
	onSaved,
}: {
	folder: Folder | null;
	onClose: () => void;
	onSaved: () => void;
}) {
	const [value, setValue] = useState("");
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (folder) setValue(folder.price ? String(folder.price) : "");
	}, [folder]);

	const trimmed = value.trim();
	const price = trimmed ? Number(trimmed) : null;
	const invalid =
		price !== null && (!Number.isInteger(price) || price < 1 || price > 100000);

	const save = async () => {
		if (!folder || invalid) return;
		setBusy(true);
		try {
			await axios.patch("/api/folder", { folderId: folder.id, price });
			toast.success(price ? "تم تحديد سعر الوحدة" : "أصبحت الوحدة مجانية");
			onSaved();
			onClose();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حفظ السعر"));
		} finally {
			setBusy(false);
		}
	};

	return (
		<AppDialog
			open={!!folder}
			onClose={onClose}
			busy={busy}
			title={`سعر «${folder?.name ?? ""}»`}
			description='مع السعر تصبح فيديوهات Bunny والملفات داخل المجلد للمشتركين فقط. اتركه فارغاً ليعود المجلد مجانياً.'
			onSubmit={() => void save()}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={busy}
						disabled={invalid}
					>
						حفظ
					</LoadingButton>
				</>
			}
		>
			<FormField
				label='السعر (₪)'
				value={value}
				onChange={(event) => setValue(event.target.value)}
				type='number'
				inputMode='numeric'
				autoFocus
				inputProps={{ min: 1, max: 100000, step: 1, dir: "ltr" }}
				error={invalid}
				helperText={invalid ? "أدخل رقماً صحيحاً بين 1 و 100000" : " "}
			/>
		</AppDialog>
	);
}
