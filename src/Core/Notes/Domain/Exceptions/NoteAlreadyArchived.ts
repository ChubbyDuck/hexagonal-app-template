import { DomainError } from '~/Core/Shared/Domain/Exceptions/DomainError';

export class NoteAlreadyArchived extends DomainError('NoteAlreadyArchived') {
  constructor(noteId: string) {
    super(`Note ${noteId} is already archived`);
  }
}
