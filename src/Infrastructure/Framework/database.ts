import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import Database from 'better-sqlite3';
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import type { AppConfig } from '~/config/config';
import * as schema from '~/db/schema';

export type DrizzleClient = BetterSQLite3Database<typeof schema> & { $client: Database.Database };

const MIGRATIONS_FOLDER = resolve(process.cwd(), 'drizzle');

export function createDatabase({ databaseUrl, dbLogEnabled }: Pick<AppConfig, 'databaseUrl' | 'dbLogEnabled'>) {
  if (databaseUrl !== ':memory:') {
    mkdirSync(dirname(resolve(databaseUrl)), { recursive: true });
  }
  const sqlite = new Database(databaseUrl);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle({ client: sqlite, schema, logger: dbLogEnabled }) satisfies DrizzleClient;
}

export function migrateDatabase(db: DrizzleClient): void {
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}
