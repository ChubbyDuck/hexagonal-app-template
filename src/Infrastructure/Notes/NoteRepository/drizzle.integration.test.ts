import { createDatabase, migrateDatabase } from '~/Infrastructure/Framework/database';

import { describeNoteRepositoryContract } from './contract';
import { createDrizzleNoteRepository } from './drizzle';

describeNoteRepositoryContract('drizzle (sqlite :memory:)', () => {
  const db = createDatabase({ databaseUrl: ':memory:', dbLogEnabled: false });
  migrateDatabase(db);
  return createDrizzleNoteRepository({ db });
});
