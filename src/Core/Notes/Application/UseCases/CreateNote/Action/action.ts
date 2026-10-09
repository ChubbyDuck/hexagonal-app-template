import { NoteView } from '~/Core/Notes/Application/Views/NoteView';
import { Note } from '~/Core/Notes/Domain/Entities/Note';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

import type { CreateNoteAction, Dependencies } from '../types';

export type { CreateNoteAction } from '../types';

export const createCreateNoteAction = ({ noteRepository, clock }: Dependencies): CreateNoteAction => ({
  async execute(command) {
    const note = Note.create({
      id: EntityId.generate(),
      title: command.title,
      body: command.body,
      createdAt: clock.now(),
    });
    await noteRepository.save(note);
    return NoteView.fromNote(note);
  },
});
