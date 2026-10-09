import type { Note } from '~/Core/Notes/Domain/Entities/Note';

/** Protocol-neutral shape returned by Notes use cases: plain JSON, no branded types or Dates. */
type NoteView = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly archivedAt: string | null;
};

const NoteView = {
  fromNote(note: Note): NoteView {
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      createdAt: note.createdAt.toISOString(),
      archivedAt: note.archivedAt?.toISOString() ?? null,
    };
  },
} as const;

type NoteListView = {
  readonly notes: readonly NoteView[];
};

const NoteListView = {
  create(notes: readonly Note[]): NoteListView {
    return { notes: notes.map(NoteView.fromNote) };
  },
} as const;

export { NoteListView, NoteView };
