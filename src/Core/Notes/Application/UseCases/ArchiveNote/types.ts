import type { NoteView } from '~/Core/Notes/Application/Views/NoteView';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';
import type { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';
import type { Clock } from '~/Core/Shared/Ports/Clock';

export type ArchiveNoteCommand = {
  readonly id: EntityId;
};

export type ArchiveNoteAction = {
  execute(command: ArchiveNoteCommand): Promise<NoteView>;
};

export type Dependencies = {
  noteRepository: NoteRepository;
  clock: Clock;
};
