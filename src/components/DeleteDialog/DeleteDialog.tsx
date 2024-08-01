import CloseIcon from "@mui/icons-material/Close";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
	styled,
	CircularProgress,
} from "@mui/material";

interface DeleteDialogProps {
	title: string;
	description: string;
	deleteDialogOpen: boolean;
	handleDeleteDialogClose: () => void;
	handleDelete: () => void;
	isDeleting: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(16),
	fontWeight: 600,
	height: 44,
	color: theme.palette.text.primary,
	border: "1px solid",
	borderColor: theme.palette.primary.main,
	boxShadow: "0px 1px 2px 0px #1018280D",
	flex: 1,
}));

export default function DeleteDialog(props: DeleteDialogProps) {
	const {
		deleteDialogOpen,
		handleDeleteDialogClose,
		handleDelete,
		title,
		description,
		isDeleting,
	} = props;
	return (
		<Dialog
			open={deleteDialogOpen}
			onClose={handleDeleteDialogClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				style: {
					maxWidth: 400,
				},
			}}
		>
			<Box position='absolute' right={24} top={24}>
				<IconButton
					color='default'
					size='small'
					onClick={handleDeleteDialogClose}
				>
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
				<Typography
					sx={(theme) => ({
						fontSize: theme.typography.pxToRem(14),
						lineHeight: theme.typography.pxToRem(20),
						color: "text.tertiary",
						mt: 0.5,
						position: "relative",
						zIndex: 1,
					})}
				>
					{description}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Stack
					direction='row'
					spacing={2}
					sx={{
						width: "100%",
					}}
				>
					<StyledButton
						onClick={handleDeleteDialogClose}
						fullWidth
						sx={{
							bgcolor: "white",
							"&:hover": {
								backgroundColor: "#E0E0E0",
							},
						}}
					>
						إلغاء
					</StyledButton>
					<StyledButton
						fullWidth
						onClick={handleDelete}
						sx={{
							backgroundColor: "#D92D20",
							borderColor: "#D92D20",
							color: "white",
							"&:hover": {
								backgroundColor: "#cf2b1f",
							},
						}}
						disabled={isDeleting}
					>
						{isDeleting ? <CircularProgress size={24} /> : "حذف"}
					</StyledButton>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
