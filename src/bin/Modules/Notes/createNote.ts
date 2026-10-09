import { createNoteInputSchema } from '~/Core/Notes/Application/UseCases/CreateNote/Entrypoint/input';
import { createNote } from '~/Core/Notes/Application/UseCases/CreateNote/Entrypoint/run';

import { parseCliArgs, parseCliInput, runCli } from '../../_cli';

const USAGE = 'note:create <title> [--body <text>]';

const { values, positionals } = parseCliArgs(
  {
    allowPositionals: true,
    options: { body: { type: 'string', short: 'b' } },
  },
  USAGE
);

const input = parseCliInput(createNoteInputSchema, { title: positionals.join(' '), body: values.body }, USAGE);

await runCli((container) => createNote(container.resolve('createNoteHandler'), input));
