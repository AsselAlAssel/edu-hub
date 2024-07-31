import { Role } from '@/types/enums'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function useRole() {
    const { data } = useSession()
    const isAdmin = data?.user?.role === Role.ADMIN
    const isUser = data?.user?.role === Role.USER
    return { isAdmin, isUser }
}
