import { describe, expect, it } from 'vitest';

import { createAppContainer } from '~/Infrastructure/Framework/container';
import { createFakeNoteRepository } from '~/Infrastructure/Notes/NoteRepository/fake';
import { createFakeClock } from '~/Infrastructure/Shared/Clock/fake';
import { createNoopLogger } from '~/Infrastructure/Shared/Logger/noop';

import { createCallerFactory } from '../trpc';
import { appRouter } from './_app';

function createCaller() {
  const container = createAppContainer({
    noteRepository: createFakeNoteRepository(),
    clock: createFakeClock(),
    logger: createNoopLogger(),
  });
  return createCallerFactory(appRouter)({ container });
}

describe('notes router', () => {
  it('creates, lists and archives a note', async () => {
    const caller = createCaller();

    const created = await caller.notes.create({ title: 'Groceries' });
    await caller.notes.archive({ id: created.id });

    expect((await caller.notes.list({})).notes).toEqual([]);
    expect((await caller.notes.list({ includeArchived: true })).notes).toHaveLength(1);
  });

  it.each([
    ['ApplicationError', () => createCaller().notes.create({ title: 'x', body: 'x'.repeat(10_001) }), 'BAD_REQUEST'],
    ['domain validation', () => createCaller().notes.create({ title: '  ' }), 'BAD_REQUEST'],
    ['EntityNotFound', () => createCaller().notes.archive({ id: 'missing' }), 'NOT_FOUND'],
  ])('maps %s to %s', async (_label, call, code) => {
    await expect(call()).rejects.toMatchObject({ code });
  });

  it('maps NoteAlreadyArchived to CONFLICT', async () => {
    const caller = createCaller();
    const { id } = await caller.notes.create({ title: 'Groceries' });
    await caller.notes.archive({ id });

    await expect(caller.notes.archive({ id })).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});
