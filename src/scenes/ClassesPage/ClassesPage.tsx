"use client";
import dynamic from "next/dynamic";
import ClassItem from "@/components/Admin/Classes/ClassItem";
import { RiseItem } from "@/components/ui/motion";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { cardGridSx } from "@/components/ui/Skeletons";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { PrimaryButton } from "@/components/ui/buttons";
import { useAllClass } from "@/hooks/useClassApi";
import useRole from "@/hooks/useRole";
import type { ClassWithMeta } from "@/libs/class";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Box, Button } from "@mui/material";
import { useState } from "react";

// Admin-only UI: loaded on demand so visitors never download the form code.
const ClassDialog = dynamic(() => import("@/components/ClassDialog"), {
	ssr: false,
});

export default function ClassesPage({ classes }: { classes: ClassWithMeta[] }) {
	const { data, error, mutate } = useAllClass(classes);
	const { isAdmin } = useRole();
	const [createOpen, setCreateOpen] = useState(false);
	const list = data ?? [];

	const createButton = isAdmin ? (
		<PrimaryButton
			startIcon={<AddRoundedIcon />}
			onClick={() => setCreateOpen(true)}
		>
			إنشاء صف جديد
		</PrimaryButton>
	) : null;

	return (
		<PageShell>
			<PageHeader
				eyebrow='المكتبة التعليمية'
				title={
					<>
						الصفوف <span className='qa-gradient-text'>الدراسية</span>
					</>
				}
				description='اختر صفّك لتصل إلى الشروحات المصوّرة والملفات المنظّمة حسب الوحدات.'
				actions={createButton}
			/>

			{error && !list.length ? (
				<ErrorState
					action={
						<Button variant='outlined' onClick={() => void mutate()}>
							إعادة المحاولة
						</Button>
					}
				/>
			) : list.length === 0 ? (
				<EmptyState
					icon={<SchoolOutlinedIcon />}
					title='لا توجد صفوف بعد'
					description={
						isAdmin
							? "ابدأ بإنشاء أول صف، ثم أضف إليه المجلدات والفيديوهات والملفات."
							: "سيتم إضافة الصفوف قريباً، عُد لاحقاً."
					}
					action={createButton}
				/>
			) : (
				<Box
					component='ul'
					sx={{ ...cardGridSx, listStyle: "none", m: 0, p: 0 }}
				>
					{list.map((classItem, index) => (
						<RiseItem
							as='li'
							key={classItem.id}
							index={index + 2}
							style={{ minWidth: 0 }}
						>
							<ClassItem
								classItem={classItem}
								priority={index < 4}
								index={index}
							/>
						</RiseItem>
					))}
				</Box>
			)}

			{isAdmin ? (
				<ClassDialog
					open={createOpen}
					handleCloseDialog={() => setCreateOpen(false)}
				/>
			) : null}
		</PageShell>
	);
}
