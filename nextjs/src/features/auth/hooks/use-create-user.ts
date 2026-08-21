import { useMutation } from '@apollo/client/react'
import { CreateUserDocument } from '@/graphql/generated/graphql'

export function useCreateUserMutation() {
    return useMutation(CreateUserDocument)
}
