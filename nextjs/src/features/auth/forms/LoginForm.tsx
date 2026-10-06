'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
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
import { useLoginUserMutation } from '../hooks/use-login-user'
import { loginSchema, type LoginValues } from '../schemas/auth/login.schema'

export function LoginForm() {
    const t = useTranslations('auth.login')
    const router = useRouter()
    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
    const schema = useMemo(() => loginSchema(t), [t])
    const form = useForm<LoginValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            login: '',
            password: '',
            pin: '',
        },
    })

    const [loginUser, { loading: isLoadingLoginUser }] = useLoginUserMutation()

    function onSubmit({ pin, ...data }: LoginValues) {
        return loginUser({
            variables: {
                data: {
                    ...data,
                    ...(pin ? { pin } : {}),
                },
            },
        })
            .then((result) => {
                if (result.data?.login.message) {
                    setIsShowTwoFactor(true)
                    return
                }

                toast.add({
                    type: 'success',
                    title: t('successTitle'),
                    description: t('successDescription'),
                })
                router.push('/dashboard/settings')
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
            backButtonHref="/account/create"
        >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    {isShowTwoFactor && (
                        <Controller
                            name="pin"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        {t('pin')}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder={t('pinPlaceholder')}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoadingLoginUser}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    )}
                    {!isShowTwoFactor && (
                    <Controller
                        name="login"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    {t('login')}
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="username"
                                    placeholder={t('loginPlaceholder')}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoadingLoginUser}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
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
                                    autoComplete="current-password"
                                    placeholder={t('passwordPlaceholder')}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoadingLoginUser}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Link
                        href="/account/recovery"
                        className="text-muted-foreground text-sm"
                    >
                        {t('forgotPassword')}
                    </Link>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoadingLoginUser}
                    >
                        {isLoadingLoginUser ? t('submitting') : t('submit')}
                    </Button>
                </FieldGroup>
            </form>
        </AuthWrapper>
    )
}
