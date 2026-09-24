"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import Surface from "@/components/ui/Surface";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Folder } from "@prisma/client";
import Link from "next/link";
import type { ReactNode } from "react";

export type DropState = "idle" | "available" | "over";

/** Folder row-card: visually distinct from media cards; doubles as a drop target. */
export default function FolderCard({
	folder,
	handle,
	onEdit,
	onDelete,
	dropState = "idle",
	isAdmin = false,
}: {
	folder: Folder;
	handle?: ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	dropState?: DropState;
	isAdmin?: boolean;
}) {
	const href = `/class/${folder.classId}/folder/${folder.id}`;
	const isOver = dropState === "over";

	return (
		<Surface
			interactive
			data-testid='folder-card'
			sx={(theme) => ({
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				minHeight: 72,
				px: 1.5,
				py: 1.25,
				height: "100%",
				...(dropState !== "idle" && {
					borderStyle: "dashed",
					borderColor: theme.palette.primary.main,
				}),
				...(isOver && {
					backgroundColor: alpha(theme.palette.primary.main, 0.1),
					boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}`,
				}),
			})}
		>
			<Box
				aria-hidden
				sx={(theme) => ({
					width: 44,
					height: 44,
					flexShrink: 0,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					color: theme.palette.primary.main,
					backgroundColor: alpha(theme.palette.primary.main, 0.12),
				})}
			>
				{isOver ? <DriveFileMoveOutlinedIcon /> : <FolderRoundedIcon />}
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant='subtitle2'
					component='h3'
					sx={{ fontSize: "1rem" }}
				>
					<Box
						component={Link}
						href={href}
						sx={(theme) => ({
							color: "text.primary",
							textDecoration: "none",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							"&::after": {
								content: '""',
								position: "absolute",
								inset: 0,
								zIndex: 1,
							},
							"&:focus-visible": { outline: "none" },
							"&:focus-visible::after": {
								outline: `2px solid ${theme.palette.primary.main}`,
								outlineOffset: -2,
								borderRadius: `${theme.tokens.radii.lg}px`,
							},
						})}
					>
						{folder.name}
					</Box>
				</Typography>
				{isOver ? (
					<Typography
						variant='caption'
						sx={{ color: "primary.main", fontWeight: 700 }}
					>
						أفلِت هنا للنقل إلى هذا المجلد
					</Typography>
				) : null}
			</Box>
			{isAdmin ? (
				<Stack direction='row' gap={0.75}>
					{handle}
					<ActionsMenu
						label={`خيارات المجلد: ${folder.name}`}
						editLabel='إعادة تسمية المجلد'
						deleteLabel='حذف المجلد'
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</Stack>
			) : (
				<ChevronLeftRoundedIcon aria-hidden sx={{ color: "text.secondary" }} />
			)}
		</Surface>
	);
}
