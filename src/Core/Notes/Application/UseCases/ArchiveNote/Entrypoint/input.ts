import { z } from 'zod';

export const archiveNoteInputSchema = z.object({
  id: z.string().min(1),
});
