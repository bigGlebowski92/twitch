import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    // The code-first NestJS backend writes this SDL file on boot and it is
    // committed, so codegen does not need a running API. Swap in
    // process.env.NEXT_PUBLIC_GRAPHQL_URL to introspect a live server instead.
    schema: '../nestjs/src/core/graphql/schema.gql',
    documents: ['./src/graphql/**/*.graphql'],
    ignoreNoDocuments: true,
    generates: {
        './src/graphql/generated/graphql.ts': {
            // v6: typescript-operations already emits used inputs/enums.
            // typescript-react-apollo is incompatible with operations v6
            // (it crashes on generate), so hooks are written next to documents.
            plugins: ['typescript-operations', 'typed-document-node'],
            config: {
                avoidOptionals: {
                    inputValue: false,
                    variableValue: false,
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
