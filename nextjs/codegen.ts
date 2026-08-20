import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    // The code-first NestJS backend writes this SDL file on boot and it is
    // committed, so codegen does not need a running API. Swap in
    // process.env.NEXT_PUBLIC_GRAPHQL_URL to introspect a live server instead.
    schema: '../nestjs/src/core/graphql/schema.gql',
    documents: ['./graphql/**/*.graphql'],
    ignoreNoDocuments: true,
    generates: {
        './graphql/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typed-document-node',
            ],
            config: {
                avoidOptionals: {
                    field: true,
                    inputValue: false,
                },
                defaultScalarType: 'unknown',
                // Apollo Client always requests __typename, but never adds it
                // to root operation types.
                nonOptionalTypename: true,
                skipTypeNameForRoot: true,
                scalars: {
                    DateTime: 'string',
                    Upload: 'File',
                },
            },
        },
    },
}

export default config
