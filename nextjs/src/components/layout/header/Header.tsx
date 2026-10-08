'use client'

import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeaderMenu } from './HeaderMenu'
import { Search } from './Search'

export function Header() {
    const t = useTranslations('header')

    return (
        <header className="bg-background fixed inset-x-0 top-0 z-50 flex h-[75px] items-center gap-2 border-b px-3">
            <div className="flex min-w-0 items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    aria-label={t('menu')}
                >
                    <Menu />
                </Button>
                <Link href="/" className="mr-2 shrink-0" aria-label={t('home')}>
                    <Image
                        src="/images/logo.svg"
                        alt=""
                        width={32}
                        height={32}
                    />
                </Link>
                <nav className="hidden items-center md:flex">
                    <Button type="button" variant="ghost" className="h-9 px-3">
                        {t('following')}
                    </Button>
                    <Button type="button" variant="ghost" className="h-9 px-3">
                        {t('browse')}
                    </Button>
                </nav>
            </div>

            <Search />

            <HeaderMenu />
        </header>
    )
}
