import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { join } from 'path';
import { IS_DEV_ENV } from '../../shared/utils/is-dev.util';

export function getGraphQLConfig(
  configService: ConfigService,
): ApolloDriverConfig {
  return {
    playground: IS_DEV_ENV
      ? {
          settings: {
            'request.credentials': 'include',
          },
        }
      : false,
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    sortSchema: true,
    resolvers: { Upload: GraphQLUpload },
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
  };
}
