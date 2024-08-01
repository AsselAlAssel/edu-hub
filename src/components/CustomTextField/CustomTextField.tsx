import { InputLabel, Stack, TextField, TextFieldProps } from "@mui/material";
import { useId } from "react";

export default function CustomTextField(props: TextFieldProps) {
	const id = useId();
	const { label, required, ...rest } = props;
	return (
		<Stack>
			{props?.label ? (
				<InputLabel htmlFor={id} required={required}>
					{label}
				</InputLabel>
			) : null}
			<TextField label={""} id={id} {...rest} />
		</Stack>
	);
}
