import { describe, expect, it } from 'vitest';

import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

import { NoteAlreadyArchived } from '../Exceptions/NoteAlreadyArchived';
import { NoteTitle } from '../Properties/NoteTitle';
import { Note } from './Note';

const createdAt = new Date('2026-01-01T10:00:00Z');
const archivedAt = new Date('2026-01-02T10:00:00Z');

const aNote = () => Note.create({ id: EntityId.generate(), title: NoteTitle.from('Groceries'), body: '', createdAt });

describe('Note', () => {
  it('is created active', () => {
    const note = aNote();

    expect(note.archivedAt).toBeNull();
    expect(Note.isArchived(note)).toBe(false);
  });

  it('archives at the given moment without mutating the original', () => {
    const note = aNote();

    const archived = Note.archive(note, archivedAt);

    expect(archived.archivedAt).toEqual(archivedAt);
    expect(Note.isArchived(archived)).toBe(true);
    expect(Note.isArchived(note)).toBe(false);
  });

  it('cannot be archived twice', () => {
    const archived = Note.archive(aNote(), archivedAt);

    expect(() => Note.archive(archived, archivedAt)).toThrow(NoteAlreadyArchived);
  });
});
