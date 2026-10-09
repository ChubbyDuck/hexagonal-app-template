import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';

import { isApplicationError } from '~/Core/Shared/Application/Exceptions/ApplicationError';

import type { Context } from './context';

// Domain errors are protocol-agnostic; this is the one place that gives them an HTTP meaning.
const NOT_FOUND_ERRORS = new Set(['EntityNotFound']);
const BAD_REQUEST_ERRORS = new Set(['InvalidNoteTitle']);
const CONFLICT_ERRORS = new Set(['NoteAlreadyArchived']);

const mapErrorToTRPCCode = (error: Error): TRPCError['code'] | null => {
  if (isApplicationError(error)) return 'BAD_REQUEST';
  if (NOT_FOUND_ERRORS.has(error.name)) return 'NOT_FOUND';
  if (BAD_REQUEST_ERRORS.has(error.name)) return 'BAD_REQUEST';
  if (CONFLICT_ERRORS.has(error.name)) return 'CONFLICT';
  return null;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

const domainErrorMiddleware = t.middleware(async ({ next }) => {
  const result = await next();
  if (!result.ok && result.error.cause instanceof Error) {
    const cause = result.error.cause;
    const code = mapErrorToTRPCCode(cause);
    if (code) throw new TRPCError({ code, message: cause.message, cause });
  }
  return result;
});

export const publicProcedure = t.procedure.use(domainErrorMiddleware);
