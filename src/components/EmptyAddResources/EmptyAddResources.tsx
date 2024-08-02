import { IconButton, Stack, styled, Tooltip, Typography } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import React, { useState } from "react";
import FolderForm from "../FolderForm";
import AttachmentsForm from "../AttachmentsForm";
import VideoForm from "../VideoForm/VideoForm";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	height: 45,
	width: 45,
	borderRadius: "50%",
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},
}));

enum ResourceType {
	FOLDER = "folder",
	FILE = "file",
	VIDEO = "video",
}

export default function EmptyAddResources({
	folderId,
	classId,
}: {
	folderId: string;
	classId: string;
}) {
	const [open, setOpen] = useState({
		folder: false,
		file: false,
		video: false,
	});

	const handleOpen = (type: ResourceType) => {
		if (type === ResourceType.FOLDER) {
			return setOpen({
				file: false,
				video: false,
				folder: true,
			});
		}

		if (type === ResourceType.FILE) {
			return setOpen({
				folder: false,
				video: false,
				file: true,
			});
		}

		if (type === ResourceType.VIDEO) {
			return setOpen({
				folder: false,
				file: false,
				video: true,
			});
		}
	};
	const handleClose = () => {
		setOpen({
			folder: false,
			file: false,
			video: false,
		});
	};
	return (
		<Stack
			justifyContent={"center"}
			alignItems={"center"}
			spacing={2}
			textAlign={"center"}
		>
			<Typography variant='h6' textAlign={"center"}>
				أضف موارد لهذا القسم
			</Typography>
			<Typography variant='body1' textAlign={"center"}>
				يمكنك إضافة موارد لهذا القسم من خلال الضغط على الازرار أدناه
			</Typography>
			<Stack direction={"row"} spacing={2}>
				<Tooltip title='إضافة مجلد جديد'>
					<StyledIconButton onClick={() => handleOpen(ResourceType.FOLDER)}>
						<FolderOpenIcon />
					</StyledIconButton>
				</Tooltip>
				<Tooltip title='إضافة ملف جديد'>
					<StyledIconButton onClick={() => handleOpen(ResourceType.FILE)}>
						<AttachFileIcon />
					</StyledIconButton>
				</Tooltip>
				<Tooltip title='إضافة فيديو جديد'>
					<StyledIconButton onClick={() => handleOpen(ResourceType.VIDEO)}>
						<OndemandVideoIcon />
					</StyledIconButton>
				</Tooltip>
			</Stack>

			<FolderForm
				open={open.folder}
				handleClose={handleClose}
				title={"إضافة مجلد جديد"}
				folderId={folderId}
				classId={classId}
			/>
			<AttachmentsForm
				open={open.file}
				handleClose={handleClose}
				title={"إضافة ملفات جدد"}
				folderId={folderId}
				classId={classId}
			/>
			<VideoForm
				open={open.video}
				handleClose={handleClose}
				title={"إضافة فيديو جديد"}
				folderId={folderId}
				classId={classId}
			/>
		</Stack>
	);
}
