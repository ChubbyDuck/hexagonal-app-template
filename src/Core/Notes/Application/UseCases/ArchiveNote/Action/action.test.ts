import { describe, expect, it } from 'vitest';

import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { NoteAlreadyArchived } from '~/Core/Notes/Domain/Exceptions/NoteAlreadyArchived';
import { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import { EntityNotFound } from '~/Core/Shared/Domain/Exceptions/EntityNotFound';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';
import { createFakeNoteRepository } from '~/Infrastructure/Notes/NoteRepository/fake';
import { createFakeClock } from '~/Infrastructure/Shared/Clock/fake';

import { ArchiveNoteCommand } from '../command';
import { createArchiveNoteAction } from './action';

const now = new Date('2026-01-05T00:00:00Z');
const note = Note.create({
  id: EntityId.generate(),
  title: NoteTitle.from('Groceries'),
  body: '',
  createdAt: new Date('2026-01-01T00:00:00Z'),
});

function createAction(notes: Note[] = [note]) {
  const noteRepository = createFakeNoteRepository(notes);
  const action = createArchiveNoteAction({ noteRepository, clock: createFakeClock(now) });
  return { action, noteRepository };
}

describe('ArchiveNoteAction', () => {
  it('archives the note at the current time', async () => {
    const { action, noteRepository } = createAction();

    const view = await action.execute(ArchiveNoteCommand.create({ id: note.id }));

    expect(view.archivedAt).toBe(now.toISOString());
    expect((await noteRepository.findById(note.id))?.archivedAt).toEqual(now);
  });

  it('throws EntityNotFound for an unknown note', async () => {
    const { action } = createAction([]);

    await expect(action.execute(ArchiveNoteCommand.create({ id: note.id }))).rejects.toThrow(EntityNotFound);
  });

  it('throws NoteAlreadyArchived for an archived note', async () => {
    const { action } = createAction([Note.archive(note, now)]);

    await expect(action.execute(ArchiveNoteCommand.create({ id: note.id }))).rejects.toThrow(NoteAlreadyArchived);
  });
});
