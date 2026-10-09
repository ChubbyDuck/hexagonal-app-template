import type { ArchiveNoteCommand } from '~/Core/Notes/Application/UseCases/ArchiveNote/types';
import { EntityId } from '~/Core/Shared/Domain/Properties/EntityId';

const ArchiveNoteCommand = {
  create(params: { id: string }): ArchiveNoteCommand {
    return { id: EntityId.from(params.id) };
  },
} as const;

export { ArchiveNoteCommand };
