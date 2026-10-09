export type ApplicationErrorInstance = Error & { readonly layer: 'application' };

/**
 * Base for errors raised while building a Command/Query (input invariants that are
 * not Domain rules). The API layer maps every ApplicationError to BAD_REQUEST.
 */
export const ApplicationError = <Name extends string>(name: Name) =>
  class extends Error {
    readonly layer = 'application' as const;
    override readonly name: Name = name;
  };

/** ApplicationError is a factory, not a constructor — do not use `instanceof ApplicationError`. */
export const isApplicationError = (error: unknown): error is ApplicationErrorInstance =>
  error instanceof Error && 'layer' in error && error.layer === 'application';
