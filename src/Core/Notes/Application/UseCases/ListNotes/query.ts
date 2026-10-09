import type { ListNotesQuery } from '~/Core/Notes/Application/UseCases/ListNotes/types';

const ListNotesQuery = {
  create(params: { includeArchived?: boolean }): ListNotesQuery {
    return { includeArchived: params.includeArchived ?? false };
  },
} as const;

export { ListNotesQuery };
