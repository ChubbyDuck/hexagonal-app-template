import { describe, expect, it } from 'vitest';

import { EntityId } from './EntityId';

describe('EntityId', () => {
  it('generates unique ids', () => {
    expect(EntityId.generate()).not.toBe(EntityId.generate());
  });

  it('wraps an existing id', () => {
    expect(EntityId.from('abc')).toBe('abc');
  });

  it('rejects an empty id', () => {
    expect(() => EntityId.from('  ')).toThrow('EntityId cannot be empty');
  });
});
