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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "../CustomTextField";

type FolderFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	name?: string;
	onSubmit: (name: string) => Promise<void>;
	isUpdatingName: boolean;
};

type FolderFormValues = {
	name: string;
};

const defaultValues = {
	name: "",
};

export default function ChangeNameForm({
	open,
	handleClose,
	title,
	name,
	onSubmit,
	isUpdatingName,
}: FolderFormProps) {
	const { control, handleSubmit, reset } = useForm<FolderFormValues>({
		defaultValues: {
			name: name || "",
		},
	});
	const handleCloseDialog = () => {
		reset(defaultValues);
		handleClose();
	};

	useEffect(() => {
		const handleEnter = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSubmit((data) => {
					onSubmit(data.name);
				})();
			}
		};
		window.addEventListener("keydown", handleEnter);
		return () => {
			window.removeEventListener("keydown", handleEnter);
		};
	}, []);

	useEffect(() => {
		if (name) {
			reset({
				name: name,
			});
		}
	}, [name]);

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
						required: "الإسم مطلوب",
					}}
					render={({ field, fieldState: { error } }) => (
						<CustomTextField
							fullWidth
							label='الإسم'
							{...field}
							error={!!error}
							helperText={error?.message}
						/>
					)}
				/>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					onClick={handleSubmit(async (data) => {
						onSubmit(data.name);
					})}
					fullWidth
					loading={isUpdatingName}
				>
					حفظ
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
