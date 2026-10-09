import { InvalidNoteTitle } from '../Exceptions/InvalidNoteTitle';

declare const __brand: unique symbol;
type NoteTitle = string & { readonly [__brand]: 'NoteTitle' };

const MAX_LENGTH = 120;

const NoteTitle = {
  MAX_LENGTH,

  from(value: string): NoteTitle {
    const trimmed = value.trim();
    if (trimmed.length === 0) throw new InvalidNoteTitle('must not be empty');
    if (trimmed.length > MAX_LENGTH) throw new InvalidNoteTitle(`must be at most ${MAX_LENGTH} characters`);
    return trimmed as NoteTitle;
  },
} as const;

export { NoteTitle };
