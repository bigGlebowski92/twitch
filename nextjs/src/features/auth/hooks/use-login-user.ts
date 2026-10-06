import { useMutation } from '@apollo/client/react'
import { LoginUserDocument } from '@/graphql/generated/graphql'

export function useLoginUserMutation() {
    return useMutation(LoginUserDocument)
}
