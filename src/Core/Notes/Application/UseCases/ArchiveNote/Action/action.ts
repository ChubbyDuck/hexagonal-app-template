import { NoteView } from '~/Core/Notes/Application/Views/NoteView';
import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { EntityNotFound } from '~/Core/Shared/Domain/Exceptions/EntityNotFound';

import type { ArchiveNoteAction, Dependencies } from '../types';

export type { ArchiveNoteAction } from '../types';

export const createArchiveNoteAction = ({ noteRepository, clock }: Dependencies): ArchiveNoteAction => ({
  async execute(command) {
    const note = await noteRepository.findById(command.id);
    if (!note) throw new EntityNotFound('Note', command.id);

    const archived = Note.archive(note, clock.now());
    await noteRepository.save(archived);
    return NoteView.fromNote(archived);
  },
});
