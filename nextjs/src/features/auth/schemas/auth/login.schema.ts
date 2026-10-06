import { z } from 'zod'

export function loginSchema(t: (key: string) => string) {
    return z.object({
        login: z.string().min(1, t('validation.loginMin')),
        password: z
            .string()
            .min(8, t('validation.passwordMin'))
            .max(32, t('validation.passwordMax')),
        pin: z.string().optional(),
    })
}

export type LoginValues = z.infer<ReturnType<typeof loginSchema>>
