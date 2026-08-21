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
import { AuthWrapper } from '@/features/auth/components/AuthWrapper'
import { useCreateUserMutation } from '@/features/auth/hooks/use-create-user'
import {
    createAccountSchema,
    type CreateAccountValues,
} from '@/features/auth/schemas/create-account.schema'

export function CreateAccountForm() {
    const t = useTranslations('auth.register')
    const [isSuccessCreateUser, setIsSuccessCreateUser] = useState(false)
    const schema = useMemo(() => createAccountSchema(t), [t])
    const form = useForm<CreateAccountValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    const [createUser, { loading: isLoadingCreateUser }] =
        useCreateUserMutation()

    function onSubmit(data: CreateAccountValues) {
        return createUser({
            variables: {
                input: data,
            },
        })
            .then(() => {
                setIsSuccessCreateUser(true)
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
            {isSuccessCreateUser ? (
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
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        {t('username')}
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="username"
                                        placeholder={t('usernamePlaceholder')}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoadingCreateUser}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
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
                                        disabled={isLoadingCreateUser}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                        autoComplete="new-password"
                                        placeholder={t('passwordPlaceholder')}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isLoadingCreateUser}
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
                            disabled={isLoadingCreateUser}
                        >
                            {isLoadingCreateUser
                                ? t('submitting')
                                : t('submit')}
                        </Button>
                    </FieldGroup>
                </form>
            )}
        </AuthWrapper>
    )
}
