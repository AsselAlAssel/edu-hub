"use client";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
	fontWeight: 500,
	fontSize: "0.9375rem",
	borderRadius: 1,
	px: 0.5,
	transition: "color 160ms ease",
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
				// Crumbs slide in from the reading start, one after another.
				"& .MuiBreadcrumbs-ol > li": {
					animation: "qaCrumb 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
				},
				...Object.fromEntries(
					Array.from({ length: 9 }, (_, i) => [
						`& .MuiBreadcrumbs-ol > li:nth-of-type(${i + 1})`,
						{ animationDelay: `${i * 50}ms` },
					])
				),
				"@keyframes qaCrumb": {
					from: { opacity: 0, transform: "translateX(10px)" },
					to: { opacity: 1, transform: "none" },
				},
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
						sx={(theme) => ({
							color:
								theme.palette.mode === "dark"
									? "primary.light"
									: "primary.main",
							fontWeight: 600,
							fontSize: "0.9375rem",
							px: 1.25,
							py: 0.25,
							borderRadius: `${theme.tokens.radii.full}px`,
							backgroundColor: alpha(theme.tokens.colors.cyan, 0.12),
							border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.35)}`,
						})}
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
