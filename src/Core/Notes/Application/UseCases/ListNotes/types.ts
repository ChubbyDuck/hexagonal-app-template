import type { NoteListView } from '~/Core/Notes/Application/Views/NoteView';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';

export type ListNotesQuery = {
  readonly includeArchived: boolean;
};

export type ListNotesAction = {
  execute(query: ListNotesQuery): Promise<NoteListView>;
};

export type Dependencies = {
  noteRepository: NoteRepository;
};
