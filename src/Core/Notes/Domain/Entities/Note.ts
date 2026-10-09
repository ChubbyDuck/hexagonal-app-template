import type { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

import { NoteAlreadyArchived } from '../Exceptions/NoteAlreadyArchived';
import type { NoteTitle } from '../Properties/NoteTitle';

type Note = {
  readonly id: EntityId;
  readonly title: NoteTitle;
  readonly body: string;
  readonly createdAt: Date;
  readonly archivedAt: Date | null;
};

const Note = {
  create(params: { id: EntityId; title: NoteTitle; body: string; createdAt: Date }): Note {
    return { ...params, archivedAt: null };
  },

  /** Rehydrate from storage. No invariants run here — the row was valid when written. */
  restore(params: Note): Note {
    return { ...params };
  },

  isArchived(note: Note): boolean {
    return note.archivedAt !== null;
  },

  archive(note: Note, at: Date): Note {
    if (Note.isArchived(note)) throw new NoteAlreadyArchived(note.id);
    return { ...note, archivedAt: at };
  },
} as const;

export { Note };
