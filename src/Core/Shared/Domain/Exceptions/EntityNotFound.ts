import { DomainError } from './DomainError';

export class EntityNotFound extends DomainError('EntityNotFound') {
  constructor(entityType: string, id: string) {
    super(`${entityType} not found: ${id}`);
  }
}
