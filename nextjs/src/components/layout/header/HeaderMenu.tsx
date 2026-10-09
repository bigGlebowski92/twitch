'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ProfileMenu } from './ProfileMenu'

export function HeaderMenu() {
    const t = useTranslations('header')
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return (
            <div className="ml-auto flex items-center gap-2">
                <Button
                    variant="secondary"
                    nativeButton={false}
                    render={<Link href="/account/login" />}
                >
                    {t('logIn')}
                </Button>
                <Button
                    nativeButton={false}
                    render={<Link href="/account/create" />}
                >
                    {t('signUp')}
                </Button>
            </div>
        )
    }

    return <ProfileMenu />
}
