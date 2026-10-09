import { migrateDatabase } from '~/Infrastructure/Framework/database';

import { runCli } from './_cli';

await runCli(async (container) => {
  migrateDatabase(container.resolve('db'));
  container.resolve('logger').info(`Migrated ${container.resolve('config').databaseUrl}`, 'CLI');
});
