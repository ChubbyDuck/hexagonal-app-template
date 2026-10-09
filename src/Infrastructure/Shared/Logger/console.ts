import type { Logger } from '~/Core/Shared/Ports/Logger';

const format = (message: string, context?: string) => (context ? `[${context}] ${message}` : message);

export const createConsoleLogger = (): Logger => ({
  info: (message, context) => console.info(format(message, context)),
  warn: (message, context) => console.warn(format(message, context)),
  error: (message, context) => console.error(format(message, context)),
});
