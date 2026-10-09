declare const __brand: unique symbol;
type EntityId = string & { readonly [__brand]: 'EntityId' };

const EntityId = {
  generate(): EntityId {
    return crypto.randomUUID() as EntityId;
  },

  from(value: string): EntityId {
    if (value.trim().length === 0) {
      throw new Error('EntityId cannot be empty');
    }
    return value as EntityId;
  },
} as const;

export { EntityId };
