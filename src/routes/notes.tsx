import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createServerCaller } from '~/server/createServerCaller';
import { useTRPC } from '~/utils/trpc';

import type { Route } from './+types/notes';

export function meta() {
  return [{ title: 'Notes' }];
}

// Server render: call the procedure in-process, then hand the result to React Query as initialData.
export async function loader() {
  const caller = await createServerCaller();
  return caller.notes.list({});
}

export default function NotesRoute({ loaderData }: Route.ComponentProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery({ ...trpc.notes.list.queryOptions({}), initialData: loaderData });

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: trpc.notes.list.queryKey() });
  const createNote = useMutation(trpc.notes.create.mutationOptions({ onSuccess: invalidateList }));
  const archiveNote = useMutation(trpc.notes.archive.mutationOptions({ onSuccess: invalidateList }));

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNote.mutate(
      { title, body },
      {
        onSuccess: () => {
          setTitle('');
          setBody('');
        },
      }
    );
  };

  return (
    <main className="page">
      <h1>Notes</h1>

      <form className="stacked" onSubmit={onSubmit}>
        <input aria-label="Title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          aria-label="Body"
          placeholder="Body (optional)"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" disabled={createNote.isPending}>
          Add note
        </button>
        {createNote.error && <p className="error">{createNote.error.message}</p>}
        {archiveNote.error && <p className="error">{archiveNote.error.message}</p>}
      </form>

      {data.notes.length === 0 ? (
        <p className="muted">No notes yet.</p>
      ) : (
        <ul className="list">
          {data.notes.map((note) => (
            <li key={note.id} className="card">
              <div>
                <strong>{note.title}</strong>
                {note.body && <p>{note.body}</p>}
                <small className="muted">{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              <button
                type="button"
                disabled={archiveNote.isPending}
                onClick={() => archiveNote.mutate({ id: note.id })}
              >
                Archive
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
