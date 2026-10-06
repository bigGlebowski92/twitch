'use client'

import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from '@/components/ui/toast'
import { useVerifyAccountMutation } from '@/features/auth/hooks/use-verify-account'
import { AuthWrapper } from '../components/AuthWrapper'

const startedTokens = new Set<string>()

export function VerifyAccountForm() {
    const t = useTranslations('auth.verify')

    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const hasStarted = useRef(false)

    const [verifyAccount, { loading: isLoadingVerifyAccount }] =
        useVerifyAccountMutation({
            onCompleted: () => {
                toast.add({
                    type: 'success',
                    title: t('successTitle'),
                    description: t('successDescription'),
                })
                router.push('/')
            },
            onError: () => {
                toast.add({
                    type: 'error',
                    title: t('errorTitle'),
                    description: t('errorDescription'),
                })
            },
        })

    useEffect(() => {
        if (!token || hasStarted.current || startedTokens.has(token)) {
            return
        }

        hasStarted.current = true
        startedTokens.add(token)
        void verifyAccount({
            variables: {
                input: { token },
            },
        })
    }, [verifyAccount, token])

    return (
        <AuthWrapper heading={t('heading')}>
            <div className="flex justify-center">
                {isLoadingVerifyAccount && (
                    <Loader className="size-8 animate-spin" />
                )}
            </div>
        </AuthWrapper>
    )
}
