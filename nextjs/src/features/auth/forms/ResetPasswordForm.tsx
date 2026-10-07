'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { useResetPasswordMutation } from '../hooks/use-reset-password'
import {
    resetPasswordSchema,
    type ResetPasswordValues,
} from '../schemas/auth/reset-password.schema'

export function ResetPasswordForm() {
    const t = useTranslations('auth.recovery')
    const [isSuccessResetPassword, setIsSuccessResetPassword] = useState(false)
    const schema = useMemo(() => resetPasswordSchema(t), [t])
    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
        },
    })

    const [resetPassword, { loading: isLoadingResetPassword }] =
        useResetPasswordMutation()

    function onSubmit(data: ResetPasswordValues) {
        return resetPassword({
            variables: {
                data,
            },
        })
            .then(() => {
                setIsSuccessResetPassword(true)
                toast.add({
                    type: 'success',
                    title: t('successTitle'),
                    description: t('successDescription'),
                })
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
            {isSuccessResetPassword ? (
                <Alert>
                    <CircleCheck className="size-4 text-green-500" />
                    <AlertTitle>{t('successTitle')}</AlertTitle>
                    <AlertDescription>
                        {t('successAlertDescription')}
                    </AlertDescription>
                </Alert>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        {t('email')}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        autoComplete="email"
                                        placeholder={t('emailPlaceholder')}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoadingResetPassword}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoadingResetPassword}
                        >
                            {isLoadingResetPassword
                                ? t('submitting')
                                : t('submit')}
                        </Button>
                    </FieldGroup>
                </form>
            )}
        </AuthWrapper>
    )
}
