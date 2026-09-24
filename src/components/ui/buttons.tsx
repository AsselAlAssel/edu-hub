"use client";
import {
	Button,
	IconButton,
	Tooltip,
	type ButtonProps,
	type IconButtonProps,
} from "@mui/material";
import { forwardRef, type ReactNode } from "react";

type Props = Omit<ButtonProps, "variant">;

/** Main call to action. */
export const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
	function PrimaryButton(props, ref) {
		return <Button ref={ref} variant='contained' color='primary' {...props} />;
	}
);

/** Bordered surface button for secondary actions. */
export const SecondaryButton = forwardRef<HTMLButtonElement, Props>(
	function SecondaryButton(props, ref) {
		return <Button ref={ref} variant='outlined' {...props} />;
	}
);

/** Low-emphasis text button. */
export const GhostButton = forwardRef<HTMLButtonElement, Props>(
	function GhostButton(props, ref) {
		return <Button ref={ref} variant='text' {...props} />;
	}
);

/** Icon-only button: the label is mandatory and doubles as the tooltip. */
export const IconAction = forwardRef<
	HTMLButtonElement,
	Omit<IconButtonProps, "aria-label"> & { label: string; children: ReactNode }
>(function IconAction({ label, children, ...props }, ref) {
	return (
		<Tooltip title={label}>
			<IconButton ref={ref} aria-label={label} {...props}>
				{children}
			</IconButton>
		</Tooltip>
	);
});
