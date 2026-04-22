import { InputLabel, Stack, TextField, TextFieldProps } from "@mui/material";
import { useId } from "react";

export default function CustomTextField(props: TextFieldProps) {
	const id = useId();
	const { label, required, sx, ...rest } = props;
	return (
		<Stack>
			{props?.label ? (
				<InputLabel htmlFor={id} required={required}>
					{label}
				</InputLabel>
			) : null}
			<TextField
				label=''
				id={id}
				variant='outlined'
				{...rest}
				sx={[
					(theme) => ({
						"& .MuiInputBase-input": {
							color: theme.palette.text.primary,
						},
						"& .MuiFormHelperText-root": {
							color: theme.palette.text.secondary,
						},
					}),
					...(Array.isArray(sx) ? sx : sx != null ? [sx] : []),
				]}
			/>
		</Stack>
	);
}
