import { listNotesInputSchema } from '~/Core/Notes/Application/UseCases/ListNotes/Entrypoint/input';
import { listNotes } from '~/Core/Notes/Application/UseCases/ListNotes/Entrypoint/run';

import { parseCliArgs, parseCliInput, runCli } from '../../_cli';

const USAGE = 'note:list [--all]';

const { values } = parseCliArgs(
  {
    options: { all: { type: 'boolean', short: 'a' } },
  },
  USAGE
);

const input = parseCliInput(listNotesInputSchema, { includeArchived: values.all }, USAGE);

await runCli((container) => listNotes(container.resolve('listNotesHandler'), input));
