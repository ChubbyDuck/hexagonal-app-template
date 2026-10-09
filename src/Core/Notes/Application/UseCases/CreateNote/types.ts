import type { NoteView } from '~/Core/Notes/Application/Views/NoteView';
import type { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';
import type { Clock } from '~/Core/Shared/Ports/Clock';

export type CreateNoteCommand = {
  readonly title: NoteTitle;
  readonly body: string;
};

export type CreateNoteAction = {
  execute(command: CreateNoteCommand): Promise<NoteView>;
};

export type Dependencies = {
  noteRepository: NoteRepository;
  clock: Clock;
};
