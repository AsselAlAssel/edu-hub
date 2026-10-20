"use client";
import {
	GoogleLogo,
	signInWithGoogle,
} from "@/components/Auth/GoogleSigninDialog";
import SortableGrid from "@/components/SortableGrid";
import { cardGridSx } from "@/components/ui/Skeletons";
import { SIGNIN_FILE_URL } from "@/libs/constant";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { File } from "@prisma/client";
import AddResourceCard from "./AddResourceCard";
import FileCard from "./FileCard";
import ResourceSection from "./ResourceSection";

// Stand-ins under the blur: guests never receive the real names or links.
const fakeFiles = (["pdf", "docx", "pdf"] as const).map(
	(type, index) =>
		({ id: `locked-${index}`, name: "ملف الدرس", type, url: "#" }) as File
);

/** Guests: blurred placeholder cards under a Google sign-in box. */
function LockedFiles() {
	return (
		<Box sx={{ position: "relative" }}>
			<Box
				aria-hidden
				inert
				sx={{
					...cardGridSx,
					filter: "blur(6px)",
					opacity: 0.6,
					userSelect: "none",
					pointerEvents: "none",
				}}
			>
				{fakeFiles.map((file) => (
					<FileCard
						key={file.id}
						file={file}
						onEdit={() => {}}
						onDelete={() => {}}
					/>
				))}
			</Box>
			<Stack
				alignItems='center'
				justifyContent='center'
				sx={{ position: "absolute", inset: 0, p: 2 }}
			>
				<Stack
					alignItems='center'
					spacing={1.5}
					sx={(theme) => ({
						p: { xs: 2.5, sm: 3 },
						maxWidth: 380,
						textAlign: "center",
						borderRadius: `${theme.tokens.radii.lg}px`,
						border: `1px solid ${theme.tokens.colors.border}`,
						backgroundColor: "background.paper",
						boxShadow: theme.shadows[4],
					})}
				>
					<LockOutlinedIcon sx={{ color: "primary.main" }} />
					<Typography
						variant='subtitle1'
						component='p'
						sx={{ fontWeight: 700 }}
					>
						ملفات الدرس متاحة للطلاب المسجّلين
					</Typography>
					<Button
						variant='outlined'
						startIcon={<GoogleLogo />}
						onClick={signInWithGoogle}
					>
						سجّل الدخول للوصول للملفات
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default function FilesSection({
	files,
	isAdmin,
	onAdd,
	onRename,
	onDelete,
	onMove,
}: {
	files: File[];
	isAdmin: boolean;
	onAdd: () => void;
	onRename: (file: File) => void;
	onDelete: (file: File) => void;
	onMove?: (file: File) => void;
}) {
	if (!files.length && !isAdmin) return null;
	const locked = !isAdmin && files.some((file) => file.url === SIGNIN_FILE_URL);

	return (
		<ResourceSection
			id='files-title'
			title='الملفات'
			count={locked ? undefined : files.length}
			icon={<DescriptionOutlinedIcon />}
		>
			{locked ? (
				<LockedFiles />
			) : (
				<SortableGrid
					items={files}
					isAdmin={isAdmin}
					gridSx={cardGridSx}
					label='الملفات'
					getHandleLabel={(file) => `إعادة ترتيب الملف: ${file.name}`}
					renderItem={(file, handle) => (
						<FileCard
							file={file}
							handle={handle}
							isAdmin={isAdmin}
							onEdit={() => onRename(file)}
							onDelete={() => onDelete(file)}
							onMove={onMove ? () => onMove(file) : undefined}
						/>
					)}
					extraItems={
						isAdmin ? (
							<Box component='li'>
								<AddResourceCard label='رفع ملف' onClick={onAdd} />
							</Box>
						) : null
					}
				/>
			)}
		</ResourceSection>
	);
}
