import { describe, expect, it } from 'vitest';

import { isDomainError } from './DomainError';
import { EntityNotFound } from './EntityNotFound';

describe('EntityNotFound', () => {
  const error = new EntityNotFound('Note', 'abc-123');

  it('formats message with entity type and id', () => {
    expect(error.message).toBe('Note not found: abc-123');
  });

  it('carries a stable name for protocol mapping', () => {
    expect(error.name).toBe('EntityNotFound');
  });

  it('is a domain-layer Error', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(EntityNotFound);
    expect(isDomainError(error)).toBe(true);
  });
});
