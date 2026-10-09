import { createContext } from './context';
import { appRouter } from './routers/_app';
import { createCallerFactory } from './trpc';

/** Call tRPC procedures in-process from route loaders/actions — no HTTP round trip. */
export async function createServerCaller() {
  const ctx = await createContext();
  return createCallerFactory(appRouter)(ctx);
}
