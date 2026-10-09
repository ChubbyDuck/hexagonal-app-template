import { Note } from '~/Core/Notes/Domain/Entities/Note';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';

export const createFakeNoteRepository = (initial: Note[] = []): NoteRepository => {
  const store = new Map<string, Note>(initial.map((note) => [note.id, note]));

  return {
    async save(note) {
      store.set(note.id, note);
    },

    async findById(id) {
      return store.get(id) ?? null;
    },

    async findAll({ includeArchived }) {
      return [...store.values()]
        .filter((note) => includeArchived || !Note.isArchived(note))
        .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
  };
};
