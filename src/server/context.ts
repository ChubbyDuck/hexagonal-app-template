import type { AwilixContainer } from 'awilix';

import { type Cradle, createAppContainer } from '~/Infrastructure/Framework/container';

export type Context = {
  container: AwilixContainer<Cradle>;
};

type AppGlobals = {
  __appContainer?: AwilixContainer<Cradle>;
  __appShutdownWired?: boolean;
};

const globals = globalThis as unknown as AppGlobals;

// Kept on globalThis so Vite SSR module reloads do not open a second SQLite handle.
function getBootContainer(): AwilixContainer<Cradle> {
  globals.__appContainer ??= createAppContainer();
  return globals.__appContainer;
}

function createRequestContainer(): AwilixContainer<Cradle> {
  const boot = getBootContainer();
  if (!import.meta.env.DEV) {
    return boot;
  }
  // Vite SSR HMR reloads use-case modules without restarting the process.
  // Rebuilding the graph per request picks up those modules while reusing the
  // boot container's long-lived resources.
  return createAppContainer({
    config: boot.resolve('config'),
    db: boot.resolve('db'),
    logger: boot.resolve('logger'),
    clock: boot.resolve('clock'),
  });
}

export const createContext = async (): Promise<Context> => ({
  container: createRequestContainer(),
});

if (typeof window === 'undefined' && !globals.__appShutdownWired) {
  globals.__appShutdownWired = true;
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, async () => {
      const container = globals.__appContainer;
      globals.__appContainer = undefined;
      await container?.dispose();
      process.exit(0);
    });
  }
}
