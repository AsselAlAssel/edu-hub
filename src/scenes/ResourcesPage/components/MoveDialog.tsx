"use client";
import AppDialog from "@/components/ui/AppDialog";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { SecondaryButton } from "@/components/ui/buttons";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
import type { Folder } from "@prisma/client";
import { useEffect, useState } from "react";

/** Keyboard-accessible alternative to dragging a file/video onto a folder. */
export default function MoveDialog({
	open,
	itemName,
	folders,
	onClose,
	onMove,
	busy,
}: {
	open: boolean;
	itemName: string;
	folders: Folder[];
	onClose: () => void;
	onMove: (folder: Folder) => Promise<void>;
	busy: boolean;
}) {
	const [targetId, setTargetId] = useState("");

	useEffect(() => {
		if (open) setTargetId(folders[0]?.id ?? "");
	}, [open, folders]);

	const target = folders.find((folder) => folder.id === targetId);

	return (
		<AppDialog
			open={open}
			onClose={onClose}
			busy={busy}
			title='نقل إلى مجلد'
			description={`اختر المجلد الذي سيُنقل إليه «${itemName}».`}
			onSubmit={() => {
				if (target) void onMove(target);
			}}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={busy}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={busy}
						disabled={!target}
					>
						نقل
					</LoadingButton>
				</>
			}
		>
			<RadioGroup
				aria-label='المجلد الهدف'
				value={targetId}
				onChange={(event) => setTargetId(event.target.value)}
			>
				{folders.map((folder) => (
					<FormControlLabel
						key={folder.id}
						value={folder.id}
						control={<Radio />}
						label={
							<Stack direction='row' alignItems='center' gap={1}>
								<FolderRoundedIcon
									fontSize='small'
									color='primary'
									aria-hidden
								/>
								{folder.name}
							</Stack>
						}
					/>
				))}
			</RadioGroup>
		</AppDialog>
	);
}
