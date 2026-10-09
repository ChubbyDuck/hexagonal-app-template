import { desc, eq, isNull } from 'drizzle-orm';

import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { NoteTitle } from '~/Core/Notes/Domain/Properties/NoteTitle';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';
import { notes } from '~/db/schema';
import type { Cradle } from '~/Infrastructure/Framework/container';

type NoteRow = typeof notes.$inferSelect;

function toDomain(row: NoteRow): Note {
  return Note.restore({
    id: EntityId.from(row.id),
    title: NoteTitle.from(row.title),
    body: row.body,
    createdAt: row.createdAt,
    archivedAt: row.archivedAt,
  });
}

function toRow(note: Note): NoteRow {
  return {
    id: note.id,
    title: note.title,
    body: note.body,
    createdAt: note.createdAt,
    archivedAt: note.archivedAt,
  };
}

export function createDrizzleNoteRepository({ db }: Pick<Cradle, 'db'>): NoteRepository {
  return {
    async save(note) {
      const row = toRow(note);
      await db.insert(notes).values(row).onConflictDoUpdate({ target: notes.id, set: row });
    },

    async findById(id) {
      const row = await db.select().from(notes).where(eq(notes.id, id)).get();
      return row ? toDomain(row) : null;
    },

    async findAll({ includeArchived }) {
      const rows = await db
        .select()
        .from(notes)
        .where(includeArchived ? undefined : isNull(notes.archivedAt))
        .orderBy(desc(notes.createdAt));
      return rows.map(toDomain);
    },
  };
}
