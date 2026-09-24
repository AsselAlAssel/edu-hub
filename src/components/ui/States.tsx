"use client";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { CircularProgress, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import IconTile from "./IconTile";
import Surface from "./Surface";

type StateProps = {
	title: string;
	description?: ReactNode;
	icon?: ReactNode;
	action?: ReactNode;
	compact?: boolean;
};

function StateLayout({
	title,
	description,
	icon,
	action,
	compact,
	tone,
	role,
}: StateProps & { tone: "primary" | "error"; role?: "alert" | "status" }) {
	return (
		<Surface
			variant='secondary'
			role={role}
			sx={{
				borderStyle: "dashed",
				boxShadow: "none",
				px: 3,
				py: compact ? 5 : { xs: 7, md: 10 },
			}}
		>
			<Stack
				alignItems='center'
				textAlign='center'
				spacing={2}
				sx={{ maxWidth: 460, mx: "auto" }}
			>
				<IconTile tone={tone} size={compact ? 48 : 60}>
					{icon}
				</IconTile>
				<Typography variant='h5' component='p'>
					{title}
				</Typography>
				{description ? (
					<Typography variant='body2' sx={{ color: "text.secondary" }}>
						{description}
					</Typography>
				) : null}
				{action ? <Stack pt={1}>{action}</Stack> : null}
			</Stack>
		</Surface>
	);
}

export function EmptyState({ icon, ...props }: StateProps) {
	return (
		<StateLayout
			tone='primary'
			role='status'
			icon={icon ?? <InboxOutlinedIcon />}
			{...props}
		/>
	);
}

export function ErrorState({
	title = "تعذّر تحميل المحتوى",
	description = "حدث خطأ غير متوقع. تحقّق من الاتصال ثم حاول مرة أخرى.",
	...props
}: Partial<StateProps>) {
	return (
		<StateLayout
			tone='error'
			role='alert'
			icon={<ErrorOutlineRoundedIcon />}
			title={title}
			description={description}
			{...props}
		/>
	);
}

export function LoadingState({ label = "جارٍ التحميل…" }: { label?: string }) {
	return (
		<Stack
			role='status'
			aria-live='polite'
			alignItems='center'
			justifyContent='center'
			spacing={2}
			sx={{ py: 10 }}
		>
			<CircularProgress size={32} aria-hidden />
			<Typography variant='body2' sx={{ color: "text.secondary" }}>
				{label}
			</Typography>
		</Stack>
	);
}
