import { describe, expect, it } from 'vitest';

import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';
import { createFakeNoteRepository } from '~/Infrastructure/Notes/NoteRepository/fake';

import { ListNotesQuery } from '../query';
import { createListNotesAction } from './action';

const aNote = (title: string, createdAt: string) =>
  Note.create({ id: EntityId.generate(), title: NoteTitle.from(title), body: '', createdAt: new Date(createdAt) });

const older = aNote('Older', '2026-01-01T00:00:00Z');
const newer = aNote('Newer', '2026-01-02T00:00:00Z');
const archived = Note.archive(aNote('Archived', '2026-01-03T00:00:00Z'), new Date('2026-01-04T00:00:00Z'));

function createAction() {
  return createListNotesAction({ noteRepository: createFakeNoteRepository([older, newer, archived]) });
}

describe('ListNotesAction', () => {
  it('lists active notes newest first', async () => {
    const view = await createAction().execute(ListNotesQuery.create({}));

    expect(view.notes.map((n) => n.title)).toEqual(['Newer', 'Older']);
  });

  it('includes archived notes on request', async () => {
    const view = await createAction().execute(ListNotesQuery.create({ includeArchived: true }));

    expect(view.notes.map((n) => n.title)).toEqual(['Archived', 'Newer', 'Older']);
  });
});
