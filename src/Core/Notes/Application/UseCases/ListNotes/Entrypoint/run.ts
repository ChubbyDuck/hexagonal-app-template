import type { z } from 'zod';

import type { ListNotesHandler } from '../handler';
import { ListNotesQuery } from '../query';
import type { listNotesInputSchema } from './input';

export async function listNotes(handler: ListNotesHandler, input: z.output<typeof listNotesInputSchema>) {
  const query = ListNotesQuery.create({ includeArchived: input.includeArchived });
  return handler.handle(query);
}
