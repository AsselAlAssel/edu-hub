"use client";
import { EmptyState } from "@/components/ui/States";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Button, Stack } from "@mui/material";

export type AddKind = "folder" | "video" | "file";

/** Admin empty state for a folder: one button per resource type. */
export default function EmptyAddResources({
	onAdd,
}: {
	onAdd: (kind: AddKind) => void;
}) {
	return (
		<EmptyState
			icon={<CreateNewFolderOutlinedIcon />}
			title='هذا المجلد فارغ'
			description='ابدأ بإضافة مجلدات لتنظيم الوحدات، أو أضف فيديوهات وملفات مباشرة.'
			action={
				<Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
					<Button
						startIcon={<CreateNewFolderOutlinedIcon />}
						onClick={() => onAdd("folder")}
					>
						مجلد جديد
					</Button>
					<Button
						variant='outlined'
						startIcon={<SmartDisplayOutlinedIcon />}
						onClick={() => onAdd("video")}
					>
						إضافة فيديو
					</Button>
					<Button
						variant='outlined'
						startIcon={<UploadFileOutlinedIcon />}
						onClick={() => onAdd("file")}
					>
						رفع ملف
					</Button>
				</Stack>
			}
		/>
	);
}
