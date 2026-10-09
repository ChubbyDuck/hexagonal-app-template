import { describe, expect, it } from 'vitest';

import { InvalidNoteTitle } from '~/Core/Notes/Domain/Exceptions/InvalidNoteTitle';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';
import { createFakeNoteRepository } from '~/Infrastructure/Notes/NoteRepository/fake';
import { createFakeClock } from '~/Infrastructure/Shared/Clock/fake';

import { CreateNoteCommand, MAX_NOTE_BODY_LENGTH, NoteBodyTooLong } from '../command';
import { createCreateNoteAction } from './action';

const now = new Date('2026-01-01T10:00:00Z');

function createAction() {
  const noteRepository = createFakeNoteRepository();
  const action = createCreateNoteAction({ noteRepository, clock: createFakeClock(now) });
  return { action, noteRepository };
}

describe('CreateNoteAction', () => {
  it('returns a view of the new note', async () => {
    const { action } = createAction();

    const view = await action.execute(CreateNoteCommand.create({ title: ' Groceries ', body: 'Milk' }));

    expect(view).toEqual({
      id: expect.any(String),
      title: 'Groceries',
      body: 'Milk',
      createdAt: now.toISOString(),
      archivedAt: null,
    });
  });

  it('persists the note', async () => {
    const { action, noteRepository } = createAction();

    const view = await action.execute(CreateNoteCommand.create({ title: 'Groceries', body: '' }));

    const stored = await noteRepository.findById(EntityId.from(view.id));
    expect(stored?.title).toBe('Groceries');
  });

  describe('command validation', () => {
    it('rejects an invalid title', () => {
      expect(() => CreateNoteCommand.create({ title: '', body: '' })).toThrow(InvalidNoteTitle);
    });

    it('rejects an oversized body', () => {
      expect(() => CreateNoteCommand.create({ title: 'x', body: 'x'.repeat(MAX_NOTE_BODY_LENGTH + 1) })).toThrow(
        NoteBodyTooLong
      );
    });
  });
});
