import { ButtonBase, ButtonProps } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ActionsIconButton(props: ButtonProps) {
	return (
		<ButtonBase
			{...props}
			sx={{
				width: 36,
				height: 36,
				bgcolor: "primary.contrastText",
				borderRadius: "8px",
				border: "1px solid #ccc",
				...props.sx,
			}}
		>
			<MoreVertIcon color='primary' />
		</ButtonBase>
	);
}
