"use client";
import { useTheme } from "@mui/material";
import { Toaster } from "react-hot-toast";

/** Toast host themed from the active palette; RTL-aware and polite for screen readers. */
const ToastContext = () => {
	const theme = useTheme();
	const { colors, shadows, radii } = theme.tokens;

	return (
		<Toaster
			position='top-center'
			containerStyle={{
				top: theme.tokens.layout.headerHeight + 12,
				zIndex: 1500,
			}}
			toastOptions={{
				duration: 4000,
				style: {
					direction: "rtl",
					fontFamily: "inherit",
					fontWeight: 600,
					background: colors.surfaceElevated,
					color: colors.textPrimary,
					border: `1px solid ${colors.border}`,
					borderRadius: radii.md,
					boxShadow: shadows.medium,
				},
				success: {
					iconTheme: {
						primary: colors.success,
						secondary: colors.surfaceElevated,
					},
				},
				error: {
					duration: 6000,
					iconTheme: {
						primary: colors.error,
						secondary: colors.surfaceElevated,
					},
				},
			}}
		/>
	);
};

export default ToastContext;
