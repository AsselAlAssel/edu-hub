import { useCreateFolder } from "@/hooks/useFolderApis";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import CustomTextField from "../CustomTextField";

type FolderFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	folderId: string;
	classId: string;
};

type FolderFormValues = {
	name: string;
};

const defaultValues = {
	name: "",
};

export default function FolderForm({
	open,
	handleClose,
	title,
	folderId,
	classId,
}: FolderFormProps) {
	const { control, handleSubmit, reset } = useForm<FolderFormValues>({
		defaultValues,
	});
	const { createFolder, isCreatingFolder } = useCreateFolder();
	const handleCloseDialog = () => {
		reset(defaultValues);
		handleClose();
	};
	const handleCreateFolder = async (data: FolderFormValues) => {
		await createFolder({
			name: data.name,
			parentFolderId: folderId,
			classId,
		});
		mutate(`/api/resources/${folderId}`);
		handleCloseDialog();
	};

	return (
		<Dialog
			open={open}
			onClose={handleCloseDialog}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				style: {
					maxWidth: 400,
				},
			}}
		>
			<Box position='absolute' right={24} top={24}>
				<IconButton color='default' size='small' onClick={handleCloseDialog}>
					<CloseIcon fontSize='inherit' />
				</IconButton>
			</Box>
			<DialogTitle
				sx={{
					p: 3,
					pb: 4,
				}}
			>
				<Typography
					sx={(theme) => ({
						fontSize: theme.typography.pxToRem(18),
						lineHeight: theme.typography.pxToRem(28),
						fontWeight: 600,
						mt: 2,
						position: "relative",
						zIndex: 1,
					})}
				>
					{title}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Controller
					name='name'
					control={control}
					rules={{
						required: "اسم المجلد مطلوب",
					}}
					render={({ field, fieldState: { error } }) => (
						<CustomTextField
							fullWidth
							placeholder='أدخل اسم المجلد'
							label='اسم المجلد'
							{...field}
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					onClick={handleSubmit((data) => handleCreateFolder(data))}
					fullWidth
					loading={isCreatingFolder}
				>
					إضافة
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
