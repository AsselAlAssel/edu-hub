import MoreVertIcon from "@mui/icons-material/MoreVert";
import { alpha, ButtonBase, ButtonProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";

const baseSx = (theme: Theme) => ({
	width: 36,
	height: 36,
	borderRadius: "8px",
	backgroundColor:
		theme.palette.mode === "dark"
			? alpha(theme.palette.common.white, 0.06)
			: theme.palette.background.paper,
	border: "1px solid",
	borderColor: "divider",
	color: "text.secondary",
	transition: theme.transitions.create(
		["background-color", "border-color", "color", "box-shadow"],
		{ duration: theme.transitions.duration.shorter }
	),
	"&:hover": {
		backgroundColor: alpha(theme.palette.primary.main, 0.1),
		borderColor: theme.palette.primary.main,
		color: theme.palette.primary.main,
	},
});

export default function ActionsIconButton(props: ButtonProps) {
	const { sx: sxProp, ...rest } = props;
	return (
		<ButtonBase
			{...rest}
			sx={[
				baseSx,
				...(Array.isArray(sxProp) ? sxProp : sxProp != null ? [sxProp] : []),
			]}
		>
			<MoreVertIcon sx={{ fontSize: 20 }} />
		</ButtonBase>
	);
}
