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
			sx={(theme) => {
				const cyan = theme.tokens.colors.cyan;
				return {
					display: "flex",
					alignItems: "center",
					gap: 1.5,
					minHeight: 76,
					px: 1.5,
					py: 1.25,
					height: "100%",
					transition: theme.transitions.create([
						"border-color",
						"box-shadow",
						"transform",
						"background-color",
					]),
					"&:hover .qa-folder-icon": {
						transform: "translateY(-2px) rotate(-6deg)",
					},
					// Every folder is a live target while a file/video is dragged.
					...(dropState !== "idle" && {
						borderStyle: "dashed",
						borderColor: alpha(cyan, 0.7),
						animation: "qaDropPulse 1.4s ease-in-out infinite",
						"@keyframes qaDropPulse": {
							"0%, 100%": { boxShadow: `0 0 0 0 ${alpha(cyan, 0)}` },
							"50%": { boxShadow: `0 0 0 4px ${alpha(cyan, 0.18)}` },
						},
					}),
					...(isOver && {
						animation: "none",
						borderStyle: "solid",
						borderColor: cyan,
						transform: "scale(1.03)",
						backgroundColor: alpha(cyan, 0.12),
						boxShadow: `0 0 0 3px ${alpha(cyan, 0.3)}, ${theme.tokens.shadows.glow}`,
					}),
				};
			}}
		>
			<Box
				aria-hidden
				className='qa-folder-icon'
				sx={(theme) => ({
					width: 46,
					height: 46,
					flexShrink: 0,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					color:
						theme.palette.mode === "dark" ? theme.tokens.colors.bg : "#fff",
					backgroundImage: isOver
						? theme.tokens.gradients.energy
						: theme.tokens.gradients.primary,
					boxShadow:
						theme.palette.mode === "dark"
							? `0 6px 18px ${alpha(theme.tokens.colors.cyan, 0.3)}`
							: theme.tokens.shadows.subtle,
					transition: theme.transitions.create("transform"),
				})}
			>
				{isOver ? <DriveFileMoveOutlinedIcon /> : <FolderRoundedIcon />}
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant='subtitle2'
					component='h3'
					sx={{ fontSize: "1.0625rem", fontWeight: 600, lineHeight: 1.6 }}
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
				<ChevronLeftRoundedIcon
					aria-hidden
					sx={(theme) => ({
						color: "text.secondary",
						transition: theme.transitions.create(["transform", "color"]),
						"*:hover > &": {
							transform: "translateX(-4px)",
							color: "primary.main",
						},
					})}
				/>
			)}
		</Surface>
	);
}
