"use client";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";

export type BreadcrumbProps = {
	/** Folder chain from the class root folder to the current folder. */
	breadcrumb: { id: string; name: string }[];
	classId: string;
	folderId: string;
	className: string;
};

const linkSx = {
	color: "text.secondary",
	textDecoration: "none",
	fontWeight: 600,
	fontSize: "0.9375rem",
	borderRadius: 1,
	px: 0.5,
	"&:hover": { color: "primary.main", textDecoration: "underline" },
} as const;

/** الصفوف › اسم الصف › مجلد › … — the root folder is shown as the class name. */
export default function Breadcrumb({
	breadcrumb,
	classId,
	folderId,
	className,
}: BreadcrumbProps) {
	const items = breadcrumb.map((item, index) => ({
		...item,
		name: index === 0 ? className : item.name,
		href: `/class/${classId}/folder/${item.id}`,
	}));

	return (
		<Breadcrumbs
			aria-label='مسار التنقل'
			separator={<ChevronLeftRoundedIcon fontSize='small' />}
			maxItems={4}
			itemsBeforeCollapse={1}
			itemsAfterCollapse={2}
			sx={{
				"& .MuiBreadcrumbs-separator": { color: "text.disabled", mx: 0.25 },
			}}
		>
			<Box component={Link} href='/classes' sx={linkSx}>
				الصفوف
			</Box>
			{items.map((item) =>
				item.id === folderId ? (
					<Typography
						key={item.id}
						aria-current='page'
						sx={{
							color: "text.primary",
							fontWeight: 700,
							fontSize: "0.9375rem",
							px: 0.5,
						}}
					>
						{item.name}
					</Typography>
				) : (
					<Box key={item.id} component={Link} href={item.href} sx={linkSx}>
						{item.name}
					</Box>
				)
			)}
		</Breadcrumbs>
	);
}
