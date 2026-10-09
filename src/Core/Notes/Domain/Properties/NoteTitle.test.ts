import { describe, expect, it } from 'vitest';

import { InvalidNoteTitle } from '../Exceptions/InvalidNoteTitle';
import { NoteTitle } from './NoteTitle';

describe('NoteTitle', () => {
  it('trims surrounding whitespace', () => {
    expect(NoteTitle.from('  Groceries  ')).toBe('Groceries');
  });

  it('rejects a blank title', () => {
    expect(() => NoteTitle.from('   ')).toThrow(InvalidNoteTitle);
  });

  it('rejects a title over the maximum length', () => {
    expect(() => NoteTitle.from('x'.repeat(NoteTitle.MAX_LENGTH + 1))).toThrow(InvalidNoteTitle);
  });
});
