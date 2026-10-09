import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { z } from 'zod';

const AppConfigSchema = z.object({
  appName: z.string(),
  databaseUrl: z.string().min(1).default('data/app.db'),
  dbLogEnabled: z.boolean().default(false),
});

export type AppConfig = z.output<typeof AppConfigSchema>;

let envFileLoaded = false;
// Vite only exposes VITE_* vars to the client; server code and the CLI read `.env` here.
function ensureEnvFileLoaded(): void {
  if (envFileLoaded) return;
  envFileLoaded = true;
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

export function createConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  if (env === process.env) {
    ensureEnvFileLoaded();
  }
  return AppConfigSchema.parse({
    appName: 'bundle-template',
    databaseUrl: env.DATABASE_URL || undefined,
    dbLogEnabled: env.DB_LOG_ENABLED === undefined ? undefined : env.DB_LOG_ENABLED === 'true',
  });
}
