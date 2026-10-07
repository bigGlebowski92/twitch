import { z } from 'zod'

export function newPasswordSchema(t: (key: string) => string) {
    return z
        .object({
            password: z
                .string()
                .min(8, t('validation.passwordMin'))
                .max(32, t('validation.passwordMax')),
            passwordConfirmation: z
                .string()
                .min(8, t('validation.passwordMin'))
                .max(32, t('validation.passwordMax')),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: t('validation.passwordConfirmation'),
            path: ['passwordConfirmation'],
        })
}

export type NewPasswordValues = z.infer<ReturnType<typeof newPasswordSchema>>
