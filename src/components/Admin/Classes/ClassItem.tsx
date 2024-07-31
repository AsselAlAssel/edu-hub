'use client';
import ActionsIconButton from "@/components/ActionsIconButton";
import useMuiMediaQuery from "@/hooks/useMuiMediaQuery";
import useRole from "@/hooks/useRole";
import { ClassesWithResources } from "@/types/types";
import { Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClassItem({ classItem }: { classItem: ClassesWithResources }) {
	const router = useRouter();
	const { isAdmin } = useRole();
	const { isMobile } = useMuiMediaQuery()
	return (
		<Stack

			justifyContent={'space-between'}
			sx={{
				borderRadius: 2,
				border: "1px solid #344054",
				overflow: "hidden",
				height: isMobile ? "208px" : "250px",
				flex: {
					xs: "0 0 292px",
					md: "0 0 300px",
				},
				minWidth: "256px",
				width: "100%",
				maxWidth: "100%",
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				cursor: "pointer",
				"& .absolute-button": {
					display: "none",
				},
			}}
			onClick={() => router.push(`/class/${classItem.id}`)}
		>
			<Typography variant='h6'>{classItem.name}</Typography>
			<Stack direction='row' justifyContent='flex-end' spacing={2}>
				<Typography variant='body2'>
					{`${classItem.folders} مجلد${classItem.folders > 1 ? 'ات' : ''}`}
				</Typography>
				<Typography variant='body2'>
					{`${classItem.videos} ملف${classItem.videos > 1 ? 'ات' : ''}`}
				</Typography>
			</Stack>
			{isAdmin &&
				<ActionsIconButton
					sx={{
						position: "absolute",
						top: 10,
						right: 10,
					}}
				/>
			}
		</Stack>
	);
}
