"use client";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	TextField,
	type TextFieldProps,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useId, useState } from "react";

export type FormFieldProps = TextFieldProps;

/**
 * Text field with its label rendered above the input (the notched floating
 * label clips Arabic text). The label is programmatically tied to the input.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
	function FormField(
		{ label, required, id: idProp, fullWidth = true, ...rest },
		ref
	) {
		const generatedId = useId();
		const id = idProp ?? generatedId;

		return (
			<Stack sx={{ width: fullWidth ? "100%" : "auto" }}>
				{label ? (
					<InputLabel htmlFor={id} required={required} error={rest.error}>
						{label}
					</InputLabel>
				) : null}
				<TextField
					ref={ref}
					id={id}
					required={required}
					fullWidth={fullWidth}
					variant='outlined'
					{...rest}
					label={undefined}
				/>
			</Stack>
		);
	}
);

/** Password input with an accessible show/hide toggle. */
export const PasswordField = forwardRef<HTMLDivElement, FormFieldProps>(
	function PasswordField(props, ref) {
		const [visible, setVisible] = useState(false);
		return (
			<FormField
				ref={ref}
				{...props}
				type={visible ? "text" : "password"}
				InputProps={{
					...props.InputProps,
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton
								edge='end'
								onClick={() => setVisible((value) => !value)}
								aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
								aria-pressed={visible}
							>
								<AnimatePresence mode='wait' initial={false}>
									<motion.span
										key={visible ? "hide" : "show"}
										initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
										animate={{ opacity: 1, scale: 1, rotate: 0 }}
										exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
										transition={{ duration: 0.18 }}
										style={{ display: "grid", placeItems: "center" }}
									>
										{visible ? (
											<VisibilityOffOutlinedIcon />
										) : (
											<VisibilityOutlinedIcon />
										)}
									</motion.span>
								</AnimatePresence>
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		);
	}
);

/** Search input with a leading icon; label is required for screen readers. */
export function SearchField({
	label,
	...props
}: Omit<FormFieldProps, "label"> & { label: string }) {
	return (
		<TextField
			type='search'
			fullWidth
			placeholder={label}
			inputProps={{ "aria-label": label, ...props.inputProps }}
			InputProps={{
				startAdornment: (
					<InputAdornment position='start'>
						<SearchRoundedIcon fontSize='small' />
					</InputAdornment>
				),
				...props.InputProps,
			}}
			{...props}
		/>
	);
}

export default FormField;
