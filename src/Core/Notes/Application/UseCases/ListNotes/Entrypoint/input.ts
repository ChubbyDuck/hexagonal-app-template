import { z } from 'zod';

export const listNotesInputSchema = z.object({
  includeArchived: z.boolean().default(false),
});
