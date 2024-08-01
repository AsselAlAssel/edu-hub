import { useCreateClass, useUpdateClass } from "@/hooks/useClassApi";
import CloseIcon from "@mui/icons-material/Close";
import {
	alpha,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import CustomTextField from "../CustomTextField";

type CreateClassForm = {
	name: string;
	description?: string;
};

interface ClassDialogProps {
	handleCloseDialog: () => void;
	open: boolean;
	selectedClass?: CreateClassForm;
	classId?: string;
}

const defaultValues = {
	name: "",
	description: "",
};

export default function ClassDialog(props: ClassDialogProps) {
	const { open, handleCloseDialog, selectedClass, classId } = props;
	const { control, handleSubmit, reset } = useForm<CreateClassForm>({
		defaultValues: selectedClass || defaultValues,
	});
	const { isMutating, trigger: createClass } = useCreateClass();
	const { isUpdating, updateClass } = useUpdateClass();

	useEffect(() => {
		if (selectedClass) {
			reset(selectedClass);
		}
		return () => {
			reset(defaultValues);
		};
	}, [selectedClass, reset]);

	const onSubmit = async (data: CreateClassForm) => {
		let success = false;
		if (classId) {
			success = await updateClass({ id: classId, ...data });
		} else {
			success = await createClass(data);
		}
		if (success) {
			mutate("/api/class");
			handleClose();
		}
	};

	const handleClose = () => {
		reset(defaultValues);
		handleCloseDialog();
	};

	return (
		<Dialog
			open={open}
			maxWidth='sm'
			fullWidth
			onClose={handleClose}
			PaperProps={{
				style: {
					maxWidth: 400,
				},
			}}
			sx={{
				bgcolor: alpha("#0C111D", 0.7),
				backdropFilter: "blur(2px)",
			}}
		>
			<Box position='absolute' right={24} top={24}>
				<IconButton color='default' size='small' onClick={handleClose}>
					<CloseIcon fontSize='inherit' />
				</IconButton>
			</Box>
			<DialogTitle>إنشاء صف جديد</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit((date) => onSubmit(date))}>
					<Stack spacing={2}>
						<Controller
							name='name'
							control={control}
							rules={{
								required: "اسم الصف مطلوب",
								maxLength: {
									value: 50,
									message: "الحد الأقصى للحروف هو 50",
								},
							}}
							render={({ field, fieldState: { error } }) => (
								<CustomTextField
									{...field}
									label='اسم الصف'
									variant='outlined'
									fullWidth
									error={!!error}
									helperText={error?.message}
									required
								/>
							)}
						/>
						<Controller
							name='description'
							control={control}
							rules={{
								maxLength: {
									value: 100,
									message: "الحد الأقصى للحروف هو 100",
								},
							}}
							render={({ field, fieldState: { error } }) => (
								<CustomTextField
									{...field}
									label='الوصف'
									variant='outlined'
									fullWidth
									multiline
									rows={4}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
						<Button type='submit' disabled={isMutating || isUpdating}>
							{isMutating || isUpdating ? (
								<CircularProgress size={24} />
							) : selectedClass ? (
								"تعديل"
							) : (
								"إنشاء"
							)}
						</Button>
					</Stack>
				</form>
			</DialogContent>
		</Dialog>
	);
}
