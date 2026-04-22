"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	alpha,
	Divider,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import type { PopoverOrigin } from "@mui/material/Popover";

type ResourceCardActionsMenuProps = {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	editLabel: string;
	onEdit: () => void;
	onDelete: () => void;
	anchorOrigin?: PopoverOrigin;
	transformOrigin?: PopoverOrigin;
};

const defaultAnchor: PopoverOrigin = {
	vertical: "bottom",
	horizontal: "right",
};

const defaultTransform: PopoverOrigin = {
	vertical: "top",
	horizontal: "right",
};

/** قائمة تعديل/حذف موحّدة لبطاقات المجلد والملف والفيديو — ألوان من `theme.palette`. */
export default function ResourceCardActionsMenu({
	anchorEl,
	open,
	onClose,
	editLabel,
	onEdit,
	onDelete,
	anchorOrigin = defaultAnchor,
	transformOrigin = defaultTransform,
}: ResourceCardActionsMenuProps) {
	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorOrigin={anchorOrigin}
			transformOrigin={transformOrigin}
			disableScrollLock
			slotProps={{
				paper: {
					sx: (theme) => ({
						minWidth: 168,
						mt: 0.5,
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
						backgroundColor: theme.palette.background.paper,
						boxShadow:
							theme.palette.mode === "dark"
								? `0 12px 40px ${alpha("#000", 0.45)}`
								: theme.shadows[8],
						py: 0.5,
						overflow: "hidden",
					}),
				},
			}}
		>
			<MenuItem
				onClick={(e) => {
					e.stopPropagation();
					onEdit();
					onClose();
				}}
				sx={(theme) => ({
					gap: 1,
					py: 1.25,
					px: 1.5,
					color: "text.primary",
					"&:hover": {
						backgroundColor: alpha(theme.palette.primary.main, 0.08),
					},
					"& .MuiListItemIcon-root": {
						minWidth: 36,
						color: "primary.main",
					},
				})}
			>
				<ListItemIcon>
					<EditIcon fontSize='small' />
				</ListItemIcon>
				<Typography variant='body2' fontWeight={600}>
					{editLabel}
				</Typography>
			</MenuItem>
			<Divider sx={{ my: 0.25, borderColor: "divider" }} />
			<MenuItem
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
					onClose();
				}}
				sx={(theme) => ({
					gap: 1,
					py: 1.25,
					px: 1.5,
					color: "error.main",
					"&:hover": {
						backgroundColor: alpha(theme.palette.error.main, 0.1),
					},
					"& .MuiListItemIcon-root": {
						minWidth: 36,
						color: "error.main",
					},
				})}
			>
				<ListItemIcon>
					<DeleteIcon fontSize='small' />
				</ListItemIcon>
				<Typography variant='body2' fontWeight={600} color='inherit'>
					حذف
				</Typography>
			</MenuItem>
		</Menu>
	);
}
