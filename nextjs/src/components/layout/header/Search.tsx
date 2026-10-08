'use client'

import { Search as SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Search() {
    const t = useTranslations('header')

    const router = useRouter()

    const [search, setSearch] = useState('')

    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (search.trim()) {
            router.push(`/streams?searchTerm=${search}`)
        } else {
            router.push('/streams')
        }
        setSearch('')
    }

    return (
        <form
            className="mx-auto hidden w-full max-w-md items-center sm:flex"
            onSubmit={onSubmit}
        >
            <Input
                type="search"
                placeholder={t('searchPlaceholder')}
                aria-label={t('search')}
                className="bg-muted h-9 rounded-r-none border-r-0"
                onChange={onSearch}
                value={search}
            />
            <Button
                type="submit"
                variant="secondary"
                size="icon-lg"
                className="rounded-l-none"
                aria-label={t('search')}
            >
                <SearchIcon />
            </Button>
        </form>
    )
}
