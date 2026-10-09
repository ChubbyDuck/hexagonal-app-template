import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';

import type { Route } from './+types/api.trpc.$';

const handler = (args: Route.LoaderArgs | Route.ActionArgs) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: args.request,
    router: appRouter,
    createContext,
  });

export const loader = handler;
export const action = handler;
