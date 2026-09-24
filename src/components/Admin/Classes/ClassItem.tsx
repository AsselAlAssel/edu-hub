"use client";
import ClassDialog from "@/components/ClassDialog";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Surface from "@/components/ui/Surface";
import { useDeleteClass } from "@/hooks/useClassApi";
import useRole from "@/hooks/useRole";
import { getErrorMessage } from "@/libs/errors";
import type { ClassWithMeta } from "@/libs/class";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

/** "3 فيديوهات · 5 ملفات" — only when the backend returned real counts. */
export function resourceSummary(counts?: { videos: number; files: number }) {
	if (!counts) return null;
	const parts: string[] = [];
	if (counts.videos)
		parts.push(
			`${counts.videos} ${counts.videos === 1 ? "فيديو" : "فيديوهات"}`
		);
	if (counts.files)
		parts.push(`${counts.files} ${counts.files === 1 ? "ملف" : "ملفات"}`);
	return parts.length ? parts.join(" · ") : null;
}

export default function ClassItem({
	classItem,
	priority = false,
}: {
	classItem: ClassWithMeta;
	priority?: boolean;
}) {
	const { isAdmin } = useRole();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const { deleteClass, isDeleting } = useDeleteClass();
	const rootFolderId = classItem.folders?.[0]?.id;
	const href = rootFolderId
		? `/class/${classItem.id}/folder/${rootFolderId}`
		: undefined;
	const summary = resourceSummary(classItem._count);
	const editValues = useMemo(
		() => ({
			name: classItem.name,
			description: classItem.description ?? "",
			image: classItem.image ?? "",
		}),
		[classItem.name, classItem.description, classItem.image]
	);

	const handleDelete = async () => {
		try {
			await deleteClass({ id: classItem.id });
			await mutate("/api/class");
			toast.success("تم حذف الصف");
			setDeleteOpen(false);
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر حذف الصف"));
		}
	};

	return (
		<>
			<Surface
				component='article'
				interactive
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflow: "hidden",
				}}
			>
				<Box
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "16 / 9",
						backgroundColor: theme.tokens.colors.surfaceSecondary,
						borderBottom: `1px solid ${theme.tokens.colors.border}`,
					})}
				>
					{classItem.image ? (
						<Image
							src={classItem.image}
							alt=''
							fill
							priority={priority}
							sizes='(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 300px'
							style={{ objectFit: "cover" }}
						/>
					) : (
						<Box
							aria-hidden
							sx={(theme) => ({
								position: "absolute",
								inset: 0,
								display: "grid",
								placeItems: "center",
								backgroundImage: `radial-gradient(80% 90% at 100% 0%, ${alpha(theme.tokens.colors.cyan, 0.2)}, transparent 70%), radial-gradient(70% 80% at 0% 100%, ${alpha(theme.tokens.colors.violet, 0.18)}, transparent 70%)`,
							})}
						>
							<Image
								src='/images/logo/logo.svg'
								alt=''
								width={56}
								height={56}
								style={{ opacity: 0.85 }}
							/>
						</Box>
					)}
				</Box>

				<Stack
					direction='row'
					alignItems='flex-start'
					gap={1}
					sx={{ p: 2.25, flex: 1 }}
				>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant='h5' component='h2'>
							{href ? (
								<Box
									component={Link}
									href={href}
									sx={{
										color: "text.primary",
										textDecoration: "none",
										// Stretched link: the whole card is clickable, one tab stop.
										"&::after": {
											content: '""',
											position: "absolute",
											inset: 0,
											zIndex: 1,
										},
										"&:focus-visible": { outline: "none" },
										"&:focus-visible::after": {
											outline: (theme) =>
												`2px solid ${theme.palette.primary.main}`,
											outlineOffset: -2,
											borderRadius: (theme) => `${theme.tokens.radii.lg}px`,
										},
									}}
								>
									{classItem.name}
								</Box>
							) : (
								classItem.name
							)}
						</Typography>
						{summary ? (
							<Typography
								variant='body2'
								sx={{ color: "text.secondary", mt: 0.5 }}
							>
								{summary}
							</Typography>
						) : null}
					</Box>
					{isAdmin ? (
						<ActionsMenu
							label={`خيارات الصف: ${classItem.name}`}
							editLabel='تعديل الصف'
							deleteLabel='حذف الصف'
							onEdit={() => setEditOpen(true)}
							onDelete={() => setDeleteOpen(true)}
						/>
					) : null}
				</Stack>
			</Surface>

			{isAdmin ? (
				<>
					<ClassDialog
						open={editOpen}
						handleCloseDialog={() => setEditOpen(false)}
						selectedClass={editValues}
						classId={classItem.id}
					/>
					<ConfirmDialog
						open={deleteOpen}
						title='حذف الصف'
						description={`سيتم حذف «${classItem.name}» مع جميع مجلداته وملفاته وفيديوهاته. لا يمكن التراجع عن ذلك.`}
						confirmLabel='حذف الصف'
						onConfirm={handleDelete}
						onClose={() => setDeleteOpen(false)}
						loading={isDeleting}
					/>
				</>
			) : null}
		</>
	);
}
