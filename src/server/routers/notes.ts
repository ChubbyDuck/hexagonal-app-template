import { archiveNoteInputSchema } from '~/Core/Notes/Application/UseCases/ArchiveNote/Entrypoint/input';
import { archiveNote } from '~/Core/Notes/Application/UseCases/ArchiveNote/Entrypoint/run';
import { createNoteInputSchema } from '~/Core/Notes/Application/UseCases/CreateNote/Entrypoint/input';
import { createNote } from '~/Core/Notes/Application/UseCases/CreateNote/Entrypoint/run';
import { listNotesInputSchema } from '~/Core/Notes/Application/UseCases/ListNotes/Entrypoint/input';
import { listNotes } from '~/Core/Notes/Application/UseCases/ListNotes/Entrypoint/run';

import { publicProcedure, router } from '../trpc';

export const notesRouter = router({
  list: publicProcedure.input(listNotesInputSchema).query(async ({ ctx, input }) => {
    const handler = ctx.container.resolve('listNotesHandler');
    return listNotes(handler, input);
  }),

  create: publicProcedure.input(createNoteInputSchema).mutation(async ({ ctx, input }) => {
    const handler = ctx.container.resolve('createNoteHandler');
    return createNote(handler, input);
  }),

  archive: publicProcedure.input(archiveNoteInputSchema).mutation(async ({ ctx, input }) => {
    const handler = ctx.container.resolve('archiveNoteHandler');
    return archiveNote(handler, input);
  }),
});
