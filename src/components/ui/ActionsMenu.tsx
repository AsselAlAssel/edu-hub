"use client";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useId, useState, type MouseEvent } from "react";

export type ActionsMenuProps = {
	/** Accessible name of the trigger, e.g. "خيارات المجلد: الوحدة الأولى". */
	label: string;
	editLabel?: string;
	deleteLabel?: string;
	onEdit: () => void;
	onDelete: () => void;
	/** Optional "move to folder" action (keyboard alternative to drag-and-drop). */
	onMove?: () => void;
	/** Optional hide/show toggle; `hidden` is the current state. */
	onToggleHidden?: () => void;
	hidden?: boolean;
};

/** Admin ⋯ menu with edit + delete; keyboard and screen-reader friendly. */
export default function ActionsMenu({
	label,
	editLabel = "إعادة التسمية",
	deleteLabel = "حذف",
	onEdit,
	onDelete,
	onMove,
	onToggleHidden,
	hidden = false,
}: ActionsMenuProps) {
	const menuId = useId();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const stop = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	};
	const run = (action: () => void) => (event: MouseEvent) => {
		stop(event);
		setAnchorEl(null);
		action();
	};

	return (
		<>
			<IconButton
				size='small'
				aria-label={label}
				aria-haspopup='menu'
				aria-expanded={open}
				aria-controls={open ? menuId : undefined}
				onClick={(event) => {
					stop(event);
					setAnchorEl(event.currentTarget);
				}}
				// Keep drag sensors and card links from reacting to the trigger.
				onPointerDown={(event) => event.stopPropagation()}
				onKeyDown={(event) => event.stopPropagation()}
				sx={(theme) => ({
					position: "relative",
					zIndex: 2,
					backgroundColor: theme.tokens.colors.surface,
					border: `1px solid ${theme.tokens.colors.border}`,
					"&:hover": { backgroundColor: theme.tokens.colors.surfaceSecondary },
				})}
			>
				<MoreHorizRoundedIcon fontSize='small' />
			</IconButton>
			<Menu
				id={menuId}
				anchorEl={anchorEl}
				open={open}
				onClose={() => setAnchorEl(null)}
				onClick={(event) => event.stopPropagation()}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				disableScrollLock
			>
				<MenuItem onClick={run(onEdit)}>
					<ListItemIcon>
						<DriveFileRenameOutlineRoundedIcon fontSize='small' />
					</ListItemIcon>
					{editLabel}
				</MenuItem>
				{onMove ? (
					<MenuItem onClick={run(onMove)}>
						<ListItemIcon>
							<DriveFileMoveOutlinedIcon fontSize='small' />
						</ListItemIcon>
						نقل إلى مجلد
					</MenuItem>
				) : null}
				{onToggleHidden ? (
					<MenuItem onClick={run(onToggleHidden)}>
						<ListItemIcon>
							{hidden ? (
								<VisibilityOutlinedIcon fontSize='small' />
							) : (
								<VisibilityOffOutlinedIcon fontSize='small' />
							)}
						</ListItemIcon>
						{hidden ? "إظهار للطلاب" : "إخفاء عن الطلاب"}
					</MenuItem>
				) : null}
				<MenuItem onClick={run(onDelete)} sx={{ color: "error.main" }}>
					<ListItemIcon>
						<DeleteOutlineRoundedIcon fontSize='small' />
					</ListItemIcon>
					{deleteLabel}
				</MenuItem>
			</Menu>
		</>
	);
}
