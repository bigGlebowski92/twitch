import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { ClearSessionDocument, MeDocument } from '@/graphql/generated/graphql'
import { useAuth } from '@/hooks/useAuth'

export function useCurrent() {
    const { isAuthenticated, logout } = useAuth()

    const { data, loading, error, refetch } = useQuery(MeDocument, {
        skip: !isAuthenticated,
    })

    const [clearSession] = useMutation(ClearSessionDocument)

    useEffect(() => {
        if (!error) {
            return
        }

        if (isAuthenticated) {
            void clearSession()
        }
        logout()
    }, [error, isAuthenticated, clearSession, logout])

    return {
        user: data?.me,
        isLoading: loading,
        refetch,
    }
}
