import type { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

import type { Note } from '../Domain/Entities/Note';

export type NoteRepository = {
  /** Insert or replace by id. */
  save(note: Note): Promise<void>;
  findById(id: EntityId): Promise<Note | null>;
  /** Newest first. */
  findAll(filter: { includeArchived: boolean }): Promise<Note[]>;
};
