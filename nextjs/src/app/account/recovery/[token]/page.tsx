import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { NewPasswordForm } from '@/features/auth/forms/NewPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.newPassword')
    return {
        title: t('heading'),
    }
}

export default async function NewPasswordPage(props: {
    params: Promise<{
        token: string
    }>
}) {
    const { token } = await props.params

    if (!token) {
        return redirect('/account/recovery')
    }

    return <NewPasswordForm token={token} />
}
