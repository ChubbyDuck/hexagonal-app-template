import type { z } from 'zod';

import { CreateNoteCommand } from '../command';
import type { CreateNoteHandler } from '../handler';
import type { createNoteInputSchema } from './input';

export async function createNote(handler: CreateNoteHandler, input: z.output<typeof createNoteInputSchema>) {
  const command = CreateNoteCommand.create({
    title: input.title,
    body: input.body,
  });
  return handler.handle(command);
}
