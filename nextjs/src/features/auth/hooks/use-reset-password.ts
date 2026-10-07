import { useMutation } from '@apollo/client/react'
import { ResetPasswordDocument } from '@/graphql/generated/graphql'

export function useResetPasswordMutation() {
    return useMutation(ResetPasswordDocument)
}
