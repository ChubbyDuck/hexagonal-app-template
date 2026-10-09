import { type AwilixContainer, type Resolver, asFunction, asValue, createContainer } from 'awilix';

import { type AppConfig, createConfig } from '~/config/config';
import {
  type ArchiveNoteAction,
  createArchiveNoteAction,
} from '~/Core/Notes/Application/UseCases/ArchiveNote/Action/action';
import {
  type ArchiveNoteHandler,
  createArchiveNoteHandler,
} from '~/Core/Notes/Application/UseCases/ArchiveNote/handler';
import {
  type CreateNoteAction,
  createCreateNoteAction,
} from '~/Core/Notes/Application/UseCases/CreateNote/Action/action';
import { type CreateNoteHandler, createCreateNoteHandler } from '~/Core/Notes/Application/UseCases/CreateNote/handler';
import { type ListNotesAction, createListNotesAction } from '~/Core/Notes/Application/UseCases/ListNotes/Action/action';
import { type ListNotesHandler, createListNotesHandler } from '~/Core/Notes/Application/UseCases/ListNotes/handler';
import type { NoteRepository } from '~/Core/Notes/Ports/NoteRepository';
import type { Clock } from '~/Core/Shared/Ports/Clock';
import type { Logger } from '~/Core/Shared/Ports/Logger';
import { createDrizzleNoteRepository } from '~/Infrastructure/Notes/NoteRepository/drizzle';
import { createSystemClock } from '~/Infrastructure/Shared/Clock/system';
import { createConsoleLogger } from '~/Infrastructure/Shared/Logger/console';

import { type DrizzleClient, createDatabase } from './database';

export type Cradle = {
  // Framework
  config: AppConfig;
  db: DrizzleClient;
  // Shared ports
  logger: Logger;
  clock: Clock;
  // Notes ports
  noteRepository: NoteRepository;
  // Notes use cases
  createNoteAction: CreateNoteAction;
  createNoteHandler: CreateNoteHandler;
  listNotesAction: ListNotesAction;
  listNotesHandler: ListNotesHandler;
  archiveNoteAction: ArchiveNoteAction;
  archiveNoteHandler: ArchiveNoteHandler;
};

/** Any cradle entry can be swapped for a ready value (tests, dev HMR, alternate adapters). */
export type ContainerOverrides = Partial<Cradle>;

type Registrations = { [K in keyof Cradle]: Resolver<Cradle[K]> };

export function createAppContainer(overrides: ContainerOverrides = {}): AwilixContainer<Cradle> {
  const container = createContainer<Cradle>({ strict: true });

  const registrations: Registrations = {
    config: asFunction(() => createConfig()).singleton(),
    db: asFunction(({ config }: Pick<Cradle, 'config'>) => createDatabase(config))
      .singleton()
      .disposer((db) => db.$client.close()),

    logger: asFunction(createConsoleLogger).singleton(),
    clock: asFunction(createSystemClock).singleton(),

    noteRepository: asFunction(createDrizzleNoteRepository).singleton(),

    createNoteAction: asFunction(createCreateNoteAction).singleton(),
    createNoteHandler: asFunction(createCreateNoteHandler).singleton(),
    listNotesAction: asFunction(createListNotesAction).singleton(),
    listNotesHandler: asFunction(createListNotesHandler).singleton(),
    archiveNoteAction: asFunction(createArchiveNoteAction).singleton(),
    archiveNoteHandler: asFunction(createArchiveNoteHandler).singleton(),
  };

  container.register(registrations);
  // Overrides are plain values; the caller owns their lifecycle, so they get no disposer.
  for (const [name, value] of Object.entries(overrides)) {
    container.register(name, asValue(value));
  }

  return container;
}
