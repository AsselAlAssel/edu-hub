import { Box } from '@mui/material'
import { Class } from '@prisma/client'
import React from 'react'

export default function ClassItem({
    classItem
}: {
    classItem: Class
}) {
    return (
        <Box
            sx={{
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                height: '100px',
                backgroundColor: '#fff',
            }}
        >
            <h2 className='text-lg font-semibold'>
                {classItem.name}
            </h2>
        </Box>
    )
}
