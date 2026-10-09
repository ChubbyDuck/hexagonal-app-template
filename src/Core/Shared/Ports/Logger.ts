type Logger = {
  info(message: string, context?: string): void;
  warn(message: string, context?: string): void;
  error(message: string, context?: string): void;
};

export type { Logger };
