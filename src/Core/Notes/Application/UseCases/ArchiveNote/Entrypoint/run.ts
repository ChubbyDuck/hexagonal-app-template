import type { z } from 'zod';

import { ArchiveNoteCommand } from '../command';
import type { ArchiveNoteHandler } from '../handler';
import type { archiveNoteInputSchema } from './input';

export async function archiveNote(handler: ArchiveNoteHandler, input: z.output<typeof archiveNoteInputSchema>) {
  const command = ArchiveNoteCommand.create({ id: input.id });
  return handler.handle(command);
}
