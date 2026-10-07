import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ResetPasswordForm } from '@/features/auth/forms/ResetPasswordForm'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.recovery')
    return {
        title: t('heading'),
    }
}

export default function RecoveryPage() {
    return <ResetPasswordForm />
}
