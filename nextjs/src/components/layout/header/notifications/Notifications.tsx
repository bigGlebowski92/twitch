'use client'

import { useQuery } from '@apollo/client/react'
import { Bell, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    FindNotificationsByUserDocument,
    FindUnreadNotificationsCountDocument,
} from '@/graphql/generated/graphql'

export function Notifications() {
    const t = useTranslations('header')
    const [isOpen, setIsOpen] = useState(false)

    const {
        data: countData,
        loading: isLoadingCount,
        refetch: refetchCount,
    } = useQuery(FindUnreadNotificationsCountDocument)

    const { data: notificationsData, loading: isLoadingNotifications } =
        useQuery(FindNotificationsByUserDocument, {
            skip: !isOpen,
            fetchPolicy: 'network-only',
        })

    useEffect(() => {
        if (!notificationsData) {
            return
        }

        void refetchCount()
    }, [notificationsData, refetchCount])

    const count = countData?.findUnreadNotificationsCount ?? 0
    const displayCount = count > 9 ? '9+' : count
    const notifications = notificationsData?.findNotificationsByUser ?? []

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        aria-label={t('notifications')}
                        className="relative"
                    />
                }
            >
                <Bell />
                {!isLoadingCount && count > 0 && (
                    <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold">
                        {displayCount}
                    </span>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b px-3 py-2 text-sm font-semibold">
                    {t('notifications')}
                </div>
                {isLoadingNotifications ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="size-5 animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                        {t('notificationsEmpty')}
                    </p>
                ) : (
                    <ul className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className="border-b px-3 py-2 last:border-b-0"
                            >
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-muted-foreground text-xs">
                                    {new Date(
                                        notification.createdAt,
                                    ).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    )
}
