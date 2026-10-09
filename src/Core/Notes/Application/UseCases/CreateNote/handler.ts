import type { NoteView } from '~/Core/Notes/Application/Views/NoteView';

import type { CreateNoteAction, CreateNoteCommand } from './types';

export type CreateNoteHandler = {
  handle(command: CreateNoteCommand): Promise<NoteView>;
};

type Dependencies = {
  createNoteAction: CreateNoteAction;
};

export const createCreateNoteHandler = ({ createNoteAction }: Dependencies): CreateNoteHandler => ({
  async handle(command) {
    return createNoteAction.execute(command);
  },
});
