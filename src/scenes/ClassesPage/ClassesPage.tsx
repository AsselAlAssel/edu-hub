"use client";
import ClassItem from "@/components/Admin/Classes/ClassItem";
import PageContainer from "@/components/PageContainer";
import { Class } from "@prisma/client";
import { Grid, Box } from "@mui/material";
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
				mb: 15,
			}}
		>
			{isAdmin && <CreateClass />}
			<Grid container spacing={4}>
				{data?.map((c) => (
					<Grid
						item
						key={c.id}
						xs={12}
						md={6}
						lg={4}
						xl={3}
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
		</PageContainer>
	);
}
