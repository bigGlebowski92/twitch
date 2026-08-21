import { HttpLink } from '@apollo/client'
import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { cookies } from 'next/headers'

export const { getClient, query, PreloadQuery } = registerApolloClient(
    async () => {
        // `credentials: 'include'` is a browser-only concept, so the session
        // cookie has to be forwarded by hand for server-side requests.
        const cookieStore = await cookies()

        return new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
                uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
                headers: { cookie: cookieStore.toString() },
                // Responses are scoped to the caller's session, so they must
                // never land in the shared Next.js data cache.
                fetchOptions: { cache: 'no-store' },
            }),
        })
    },
)
