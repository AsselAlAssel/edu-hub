import { ButtonBase, ButtonProps } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

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
			<MoreHorizIcon color='primary' />
		</ButtonBase>
	);
}
