export type DomainErrorInstance = Error & { readonly layer: 'domain' };

/**
 * Base for errors raised by Domain rules. `name` is the stable identifier the API
 * layer maps to a protocol status (see `src/server/trpc.ts`).
 *
 * @example
 *   export class NoteAlreadyArchived extends DomainError('NoteAlreadyArchived') {}
 */
export const DomainError = <Name extends string>(name: Name) =>
  class extends Error {
    readonly layer = 'domain' as const;
    override readonly name: Name = name;
  };

/** DomainError is a factory, not a constructor — do not use `instanceof DomainError`. */
export const isDomainError = (error: unknown): error is DomainErrorInstance =>
  error instanceof Error && 'layer' in error && error.layer === 'domain';
