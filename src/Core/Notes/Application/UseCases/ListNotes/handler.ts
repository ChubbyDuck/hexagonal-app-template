import type { NoteListView } from '~/Core/Notes/Application/Views/NoteView';

import type { ListNotesAction, ListNotesQuery } from './types';

export type ListNotesHandler = {
  handle(query: ListNotesQuery): Promise<NoteListView>;
};

type Dependencies = {
  listNotesAction: ListNotesAction;
};

export const createListNotesHandler = ({ listNotesAction }: Dependencies): ListNotesHandler => ({
  async handle(query) {
    return listNotesAction.execute(query);
  },
});
