import type { CreateNoteCommand } from '~/Core/Notes/Application/UseCases/CreateNote/types';
import { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import { ApplicationError } from '~/Core/Shared/Application/Exceptions/ApplicationError';

export const MAX_NOTE_BODY_LENGTH = 10_000;

export class NoteBodyTooLong extends ApplicationError('NoteBodyTooLong') {
  constructor() {
    super(`Note body must be at most ${MAX_NOTE_BODY_LENGTH} characters`);
  }
}

const CreateNoteCommand = {
  create(params: { title: string; body: string }): CreateNoteCommand {
    if (params.body.length > MAX_NOTE_BODY_LENGTH) {
      throw new NoteBodyTooLong();
    }
    return {
      title: NoteTitle.from(params.title),
      body: params.body,
    };
  },
} as const;

export { CreateNoteCommand };
