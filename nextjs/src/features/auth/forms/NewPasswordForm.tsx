'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { AuthWrapper } from '../components/AuthWrapper'
import { useNewPasswordMutation } from '../hooks/use-new-password'
import {
    newPasswordSchema,
    type NewPasswordValues,
} from '../schemas/auth/new-password.schema'

interface NewPasswordFormProps {
    token: string
}

export function NewPasswordForm({ token }: NewPasswordFormProps) {
    const t = useTranslations('auth.newPassword')
    const router = useRouter()
    const schema = useMemo(() => newPasswordSchema(t), [t])
    const form = useForm<NewPasswordValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
    })

    const [setNewPassword, { loading: isLoadingNewPassword }] =
        useNewPasswordMutation()

    function onSubmit(data: NewPasswordValues) {
        return setNewPassword({
            variables: {
                data: {
                    ...data,
                    token,
                },
            },
        })
            .then(() => {
                toast.add({
                    type: 'success',
                    title: t('successTitle'),
                    description: t('successDescription'),
                })
                router.push('/account/login')
            })
            .catch((error: Error) => {
                toast.add({
                    type: 'error',
                    title: t('errorTitle'),
                    description: error.message,
                })
            })
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref="/account/login"
        >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    {t('password')}
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={t('passwordPlaceholder')}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoadingNewPassword}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="passwordConfirmation"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    {t('passwordConfirmation')}
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={t('passwordPlaceholder')}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoadingNewPassword}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoadingNewPassword}
                    >
                        {isLoadingNewPassword ? t('submitting') : t('submit')}
                    </Button>
                </FieldGroup>
            </form>
        </AuthWrapper>
    )
}
