import { z } from 'zod'

export function createAccountSchema(t: (key: string) => string) {
    return z.object({
        username: z
            .string()
            .min(3, t('validation.usernameMin'))
            .max(20, t('validation.usernameMax'))
            .regex(
                /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
                t('validation.usernameRegex'),
            ),
        email: z.email(t('validation.email')),
        password: z
            .string()
            .min(8, t('validation.passwordMin'))
            .max(32, t('validation.passwordMax')),
    })
}

export type CreateAccountValues = z.infer<ReturnType<typeof createAccountSchema>>
