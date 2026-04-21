import ActionsIconButton from "@/components/ActionsIconButton";
import usePopoverState from "@/hooks/usePopoverState";
import useRole from "@/hooks/useRole";
import { ICONS_FORMAT_FILE } from "@/libs/constant";
import {
	alpha,
	Stack,
	Typography,
	Menu,
	ListItem,
	ListItemIcon,
	Box,
} from "@mui/material";
import { File } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

export default function FileCard({
	file,
	onEdit,
	onDelete,
}: {
	file: File;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const WarperComponent = file.url !== "#" ? "a" : "div";

	const isFormatKnown = useMemo(() => {
		return ICONS_FORMAT_FILE.includes(file.type);
	}, [file.name]);
	const { isAdmin } = useRole();

	const isClosed = useMemo(() => {
		return file.url === "#";
	}, [file.url]);

	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={(theme) => ({
				borderRadius: 1,
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor:
					theme.palette.mode === "dark"
						? alpha(theme.palette.background.paper, 0.9)
						: alpha(theme.palette.primary.main, 0.04),
				flex: 1,
				top: 0,
				transition: "top 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.2s ease",
				position: "relative",
				height: "100%",
				border: `1px solid ${theme.palette.border.secondary}`,
				"& .absolute-button": {
					display: "none",
				},

				"&:hover": {
					backgroundColor:
						theme.palette.mode === "dark"
							? theme.palette.background.paper
							: alpha(theme.palette.primary.main, 0.08),
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
					...(!isAdmin && {
						top: "-6px",
					}),
				},
			})}
			gap={1}
		>
			<WarperComponent
				href={file.url ?? "#"}
				download={true}
				target='_blank'
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				<Typography
					variant='h6'
					sx={(theme) => ({
						maxWidth: "80%",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						textOverflow: "ellipsis",
						cursor: "pointer",
						minHeight: "3.6rem",
						lineHeight: "1.8rem",
						color: theme.palette.text.primary,
					})}
				>
					{file.name}
				</Typography>

				<Stack
					justifyContent='center'
					alignItems='center'
					p={3}
					sx={(theme) => ({
						borderRadius: 1,
						backgroundColor: theme.palette.background.paper,
						mt: 2,
						position: "relative",
						border: `1px solid ${theme.palette.border.secondary}`,
					})}
				>
					{isFormatKnown ? (
						<Image
							src={`/icons/${file.type}.svg`}
							alt={file.type}
							width={70}
							height={70}
						/>
					) : (
						<Image
							src={`/icons/unknown.svg`}
							alt={file.type}
							width={70}
							height={70}
						/>
					)}
					{isClosed ? (
						<Box
							sx={{
								position: "absolute",
								top: "0",
								right: "0",
								bottom: "0",
								left: "0",
								backgroundColor: "rgba(0,0,0,0.5)",
								backdropFilter: "blur(5px)",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 1,
							}}
						>
							<LockIcon
								sx={{
									color: "common.white",
								}}
							/>
						</Box>
					) : null}
				</Stack>
			</WarperComponent>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<ListItem
					sx={{
						cursor: "pointer",
					}}
					onClick={(e) => {
						e.stopPropagation();
						onEdit();
						handleClose();
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<Typography>تفير الإسم</Typography>
				</ListItem>
				<ListItem
					sx={{
						cursor: "pointer",
					}}
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
						handleClose();
					}}
				>
					<ListItemIcon>
						<DeleteIcon
							sx={{
								color: "error.main",
							}}
						/>
					</ListItemIcon>
					<Typography color='error.main'>حذف</Typography>
				</ListItem>
			</Menu>
			{isAdmin ? (
				<ActionsIconButton
					sx={{
						position: "absolute",
						top: 10,
						right: 10,
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleOpen(e);
					}}
				/>
			) : null}
		</Stack>
	);
}
