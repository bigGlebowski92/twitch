import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { VerifyAccountForm } from '@/features/auth/forms/VerifyAccountForm'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.verify')
    return {
        title: t('heading'),
    }
}

export default async function VerifyAccountPage(props: {
    searchParams: Promise<{
        token: string
    }>
}) {
    const { token } = await props.searchParams

    if (!token) {
        return redirect('/account/create')
    }

    return <VerifyAccountForm />
}
