import { z } from 'zod'

export function resetPasswordSchema(t: (key: string) => string) {
    return z.object({
        email: z.email(t('validation.email')),
    })
}

export type ResetPasswordValues = z.infer<ReturnType<typeof resetPasswordSchema>>
