import { DomainError } from '~/Core/Shared/Domain/Exceptions/DomainError';

export class InvalidNoteTitle extends DomainError('InvalidNoteTitle') {
  constructor(reason: string) {
    super(`Note title ${reason}`);
  }
}
