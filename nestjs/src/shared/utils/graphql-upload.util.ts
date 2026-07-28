import type { RequestHandler } from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

interface GraphqlUploadOptions {
  maxFileSize?: number;
  maxFiles?: number;
}

export function buildGraphqlUploadMiddleware(
  options?: GraphqlUploadOptions,
): RequestHandler {
  return graphqlUploadExpress(options) as RequestHandler;
}
