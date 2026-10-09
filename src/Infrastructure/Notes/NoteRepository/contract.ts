import { describe, expect, it } from 'vitest';

import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

const aNote = (title: string, createdAt: string) =>
  Note.create({ id: EntityId.generate(), title: NoteTitle.from(title), body: 'body', createdAt: new Date(createdAt) });

/**
 * Behaviour every NoteRepository adapter must share. Run it against the fake (unit)
 * and against each real adapter (integration) so fakes cannot drift from production.
 */
export function describeNoteRepositoryContract(name: string, makeRepository: () => NoteRepository) {
  describe(`NoteRepository contract: ${name}`, () => {
    it('finds a saved note by id', async () => {
      const repository = makeRepository();
      const note = aNote('First', '2026-01-01T00:00:00Z');

      await repository.save(note);

      expect(await repository.findById(note.id)).toEqual(note);
    });

    it('returns null for an unknown id', async () => {
      expect(await makeRepository().findById(EntityId.generate())).toBeNull();
    });

    it('replaces an existing note on save', async () => {
      const repository = makeRepository();
      const note = aNote('First', '2026-01-01T00:00:00Z');
      const archived = Note.archive(note, new Date('2026-01-02T00:00:00Z'));

      await repository.save(note);
      await repository.save(archived);

      expect(await repository.findById(note.id)).toEqual(archived);
    });

    it('lists newest first and hides archived notes unless asked', async () => {
      const repository = makeRepository();
      const older = aNote('Older', '2026-01-01T00:00:00Z');
      const newer = aNote('Newer', '2026-01-02T00:00:00Z');
      const archived = Note.archive(aNote('Archived', '2026-01-03T00:00:00Z'), new Date('2026-01-04T00:00:00Z'));
      for (const note of [older, archived, newer]) await repository.save(note);

      expect(await repository.findAll({ includeArchived: false })).toEqual([newer, older]);
      expect(await repository.findAll({ includeArchived: true })).toEqual([archived, newer, older]);
    });
  });
}
