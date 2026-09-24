"use client";
import ClassItem from "@/components/Admin/Classes/ClassItem";
import ClassDialog from "@/components/ClassDialog";
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
				title='الصفوف الدراسية'
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
						<Box component='li' key={classItem.id} sx={{ minWidth: 0 }}>
							<ClassItem classItem={classItem} priority={index < 4} />
						</Box>
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
