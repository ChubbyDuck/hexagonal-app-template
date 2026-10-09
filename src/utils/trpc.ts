import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

import type { AppRouter } from '~/server/routers/_app';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function createAppTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
  });
}
