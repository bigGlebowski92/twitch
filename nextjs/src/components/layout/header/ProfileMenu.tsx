'use client'

import { useMutation } from '@apollo/client/react'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutUserDocument } from '@/graphql/generated/graphql'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { Notifications } from './notifications/Notifications'

export function ProfileMenu() {
    const t = useTranslations('header')
    const router = useRouter()
    const { logout } = useAuth()
    const { user, isLoading } = useCurrent()
    const [logoutUser, { loading: isLoggingOut }] =
        useMutation(LogoutUserDocument)

    const displayName = user?.displayName || user?.username || ''
    const initial = displayName.charAt(0).toUpperCase() || 'U'

    async function onLogout() {
        try {
            await logoutUser()
        } finally {
            logout()
            router.push('/account/login')
            router.refresh()
        }
    }

    if (isLoading) {
        return <Loader2 className="ml-auto size-6 animate-spin" />
    }

    return (
        <div className="ml-auto flex items-center gap-2">
            <Notifications />
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label={t('profile')}
                        className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-3"
                    >
                        <Avatar>
                            {user?.avatar && (
                                <AvatarImage
                                    src={user.avatar}
                                    alt={displayName}
                                />
                            )}
                            <AvatarFallback>{initial}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() =>
                                user && router.push(`/${user.username}`)
                            }
                        >
                            {t('profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push('/dashboard/settings')}
                        >
                            {t('settings')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            disabled={isLoggingOut}
                            onClick={() => void onLogout()}
                        >
                            {t('logOut')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
