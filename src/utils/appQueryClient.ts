import { QueryClient } from '@tanstack/react-query';

function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Loader data seeds `initialData`; do not refetch it the moment the page hydrates.
        staleTime: 30 * 1000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Browser: one shared client for the whole session.
 * Server: a new client per call so SSR requests never share cache.
 */
export function getAppQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return createAppQueryClient();
  }
  browserQueryClient ??= createAppQueryClient();
  return browserQueryClient;
}
