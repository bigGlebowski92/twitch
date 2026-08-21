'use client'

import { PropsWithChildren } from 'react'
import { Toaster } from '@/components/ui/toast'

export function ToastProvider({ children }: PropsWithChildren) {
    return <Toaster>{children}</Toaster>
}
