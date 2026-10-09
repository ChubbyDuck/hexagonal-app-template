import type { NoteView } from '~/Core/Notes/Application/Views/NoteView';

import type { ArchiveNoteAction, ArchiveNoteCommand } from './types';

export type ArchiveNoteHandler = {
  handle(command: ArchiveNoteCommand): Promise<NoteView>;
};

type Dependencies = {
  archiveNoteAction: ArchiveNoteAction;
};

export const createArchiveNoteHandler = ({ archiveNoteAction }: Dependencies): ArchiveNoteHandler => ({
  async handle(command) {
    return archiveNoteAction.execute(command);
  },
});
