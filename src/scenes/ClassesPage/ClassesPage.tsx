"use client";
import ClassItem from "@/components/Admin/Classes/ClassItem";
import PageContainer from "@/components/PageContainer";
import { Class } from "@prisma/client";
import { Grid, Box, Stack, Typography } from "@mui/material";
import React from "react";
import CreateClass from "./component/CreateClass";
import { useAllClass } from "@/hooks/useClassApi";
import useRole from "@/hooks/useRole";

export default function ClassesPage({ classes }: { classes: Class[] }) {
	const { data } = useAllClass(classes);
	const { isAdmin } = useRole();

	return (
		<PageContainer
			sx={{
				mb: 10,
			}}
		>
			<Stack spacing={4}>
				<Box
					sx={{
						textAlign: "center",
						mb: { xs: 1, md: 2 },
					}}
				>
					<Typography
						variant='h3'
						sx={{
							fontWeight: 800,
							mb: 1,
						}}
					>
						الصفوف الدراسية
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: "text.tertiary",
							maxWidth: 500,
							mx: "auto",
						}}
					>
						اختر الصف الذي تريد البدء به واستكشف المحتوى التعليمي
					</Typography>
				</Box>
				{isAdmin && <CreateClass />}
				<Grid container spacing={3}>
					{data?.map((c) => (
						<Grid
							item
							key={c.id}
							xs={12}
							sm={6}
							md={4}
							lg={3}
							sx={{
								display: "flex",
								width: "100%",
							}}
						>
							<Box
								sx={{
									flexGrow: 1,
									display: "flex",
									width: "100%",
								}}
							>
								<ClassItem classItem={c} />
							</Box>
						</Grid>
					))}
				</Grid>
			</Stack>
		</PageContainer>
	);
}
