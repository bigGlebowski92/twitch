import { useMutation } from '@apollo/client/react'
import { VerifyAccountDocument } from '@/graphql/generated/graphql'

export function useVerifyAccountMutation() {
    return useMutation(VerifyAccountDocument)
}
