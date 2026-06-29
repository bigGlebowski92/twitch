import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { IS_DEV_ENV } from '../../shared/utils/is-dev.util';

export function getGraphQLConfig(
  configService: ConfigService,
): ApolloDriverConfig {
  return {
    playground: IS_DEV_ENV,
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
  };
}
