import { useAddVideo } from "@/hooks/useResourceApi";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "../CustomTextField";
import { mutate } from "swr";
import {
	getYouTubeVideoID,
	isYouTubeVideo,
	youtubeRegex,
} from "@/libs/constant";

type FolderFormProps = {
	open: boolean;
	handleClose: () => void;
	title: string;
	folderId: string;
	classId: string;
};

type VideoFormValues = {
	name: string;
	url: string;
};

const defaultValues = {
	name: "",
	url: "",
};

export default function VideoForm({
	open,
	handleClose,
	title,
	folderId,
	classId,
}: FolderFormProps) {
	const { control, handleSubmit, setError, clearErrors, reset } =
		useForm<VideoFormValues>({
			defaultValues,
		});
	const { addVideo, isLoading } = useAddVideo();

	const handleCloseDialog = () => {
		reset(defaultValues);
		handleClose();
	};

	const onSubmit = async (data: VideoFormValues) => {
		const videId = getYouTubeVideoID(data.url) ?? "";
		await addVideo({
			name: data.name,
			url: data.url,
			folderId,
			classId,
			videoId: videId,
		});
		mutate(`/api/resources/${folderId}`);
		handleCloseDialog();
		reset(defaultValues);
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={2}>
						<Controller
							name='name'
							control={control}
							rules={{
								required: "يجب ادخال اسم الفيديو",
							}}
							render={({ field, fieldState: { error } }) => (
								<CustomTextField
									{...field}
									label='اسم الفيديو'
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
						<Controller
							name='url'
							control={control}
							rules={{
								required: "يجب ادخال رابط الفيديو",
								pattern: {
									value: youtubeRegex,
									message: "يجب ادخال رابط يوتيوب",
								},
							}}
							render={({ field, fieldState: { error } }) => (
								<CustomTextField
									{...field}
									label='رابط الفيديو على يوتيوب'
									error={!!error}
									helperText={error?.message}
									onBlur={(e) => {
										const url = e.target.value.trim() as string;
										if (!url) {
											setError("url", { message: "يجب ادخال رابط الفيديو" });
											return;
										}
										if (!isYouTubeVideo(url)) {
											setError("url", { message: "يجب ادخال رابط يوتيوب" });
											return;
										}
										clearErrors("url");
										field.onChange(url);
									}}
								/>
							)}
						/>
					</Stack>
				</form>
			</DialogContent>
			<DialogActions>
				<LoadingButton
					fullWidth
					onClick={handleSubmit(onSubmit)}
					loading={isLoading}
				>
					إضافة
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
