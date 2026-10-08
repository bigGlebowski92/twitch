'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

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

    return (
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label={t('profile')}
                    className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                    <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        {t('logOut')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
