import { NoteListView } from '~/Core/Notes/Application/Views/NoteView';

import type { Dependencies, ListNotesAction } from '../types';

export type { ListNotesAction } from '../types';

export const createListNotesAction = ({ noteRepository }: Dependencies): ListNotesAction => ({
  async execute(query) {
    const notes = await noteRepository.findAll({ includeArchived: query.includeArchived });
    return NoteListView.create(notes);
  },
});
