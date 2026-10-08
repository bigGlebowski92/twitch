import { useMutation } from '@apollo/client/react'
import {
    VerifyAccountDocument,
    type VerifyAccountMutation,
    type VerifyAccountMutationVariables,
} from '@/graphql/generated/graphql'

type VerifyAccountOptions = Parameters<
    typeof useMutation<VerifyAccountMutation, VerifyAccountMutationVariables>
>[1]

export function useVerifyAccountMutation(options?: VerifyAccountOptions) {
    return useMutation(VerifyAccountDocument, options)
}
