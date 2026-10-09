import type { Logger } from '~/Core/Shared/Ports/Logger';

export const createNoopLogger = (): Logger => ({
  info: () => {},
  warn: () => {},
  error: () => {},
});
