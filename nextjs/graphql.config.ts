import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    documents: ['./graphql/**/*.graphql'],
    generates: {
        './generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
        },
    },
    ignoreNoDocuments: true,
}

export default config
