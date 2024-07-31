import ClassItem from '@/components/Admin/Classes/ClassItem'
import PageContainer from '@/components/PageContainer'
import { ClassesWithResources } from '@/types/types'
import { Grid } from '@mui/material'
import React from 'react'

export default function ClassesPage({
    classes
}: {
    classes: ClassesWithResources[]
}) {
    return (
        <PageContainer>
            <Grid container spacing={2}>
                {classes.map((c) => (
                    <Grid item key={c.id} xs={12} md={6} lg={4}>
                        <ClassItem classItem={c} />
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    )
}
