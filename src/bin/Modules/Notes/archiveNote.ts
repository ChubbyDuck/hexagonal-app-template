import { archiveNoteInputSchema } from '~/Core/Notes/Application/UseCases/ArchiveNote/Entrypoint/input';
import { archiveNote } from '~/Core/Notes/Application/UseCases/ArchiveNote/Entrypoint/run';

import { parseCliArgs, parseCliInput, runCli } from '../../_cli';

const USAGE = 'note:archive <id>';

const { positionals } = parseCliArgs({ allowPositionals: true }, USAGE);

const input = parseCliInput(archiveNoteInputSchema, { id: positionals[0] }, USAGE);

await runCli((container) => archiveNote(container.resolve('archiveNoteHandler'), input));
