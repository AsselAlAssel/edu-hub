"use client";
import ClassDialog from "@/components/ClassDialog";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";

export default function CreateClass() {
	const [open, setOpen] = useState(false);
	return (
		<Box mb={2}>
			<Button onClick={() => setOpen(true)}> إنشاء صف جديد </Button>
			<ClassDialog open={open} handleCloseDialog={() => setOpen(false)} />
		</Box>
	);
}
