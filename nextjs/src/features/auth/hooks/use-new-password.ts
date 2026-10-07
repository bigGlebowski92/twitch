import { useMutation } from '@apollo/client/react'
import { NewPasswordDocument } from '@/graphql/generated/graphql'

export function useNewPasswordMutation() {
    return useMutation(NewPasswordDocument)
}
