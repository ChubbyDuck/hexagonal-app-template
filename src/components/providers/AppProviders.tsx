import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { getAppQueryClient } from '~/utils/appQueryClient';
import { TRPCProvider, createAppTrpcClient } from '~/utils/trpc';

export function AppProviders({ children }: { children: React.ReactNode }) {
  // useState so SSR gets a per-request client; on the browser getAppQueryClient returns the singleton.
  const [queryClient] = useState(getAppQueryClient);
  const [trpcClient] = useState(createAppTrpcClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
