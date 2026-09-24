"use client";
import ChangeNameForm from "@/components/ChangeNameForm";

/** Create / rename folder dialog. */
export default function FolderForm({
	open,
	handleClose,
	folderName,
	onSubmit,
	busy,
}: {
	open: boolean;
	handleClose: () => void;
	/** Present when renaming. */
	folderName?: string;
	onSubmit: (name: string) => Promise<void>;
	busy: boolean;
}) {
	const isRename = !!folderName;
	return (
		<ChangeNameForm
			open={open}
			handleClose={handleClose}
			title={isRename ? "إعادة تسمية المجلد" : "مجلد جديد"}
			name={folderName}
			label='اسم المجلد'
			placeholder='مثال: الوحدة الأولى — الحركة'
			submitLabel={isRename ? "حفظ الاسم" : "إنشاء المجلد"}
			onSubmit={onSubmit}
			isUpdatingName={busy}
		/>
	);
}
