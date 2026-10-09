import { z } from 'zod';

export const createNoteInputSchema = z.object({
  title: z.string(),
  body: z.string().default(''),
});
