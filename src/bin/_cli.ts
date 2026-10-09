import { type ParseArgsConfig, parseArgs } from 'node:util';

import type { AwilixContainer } from 'awilix';
import { z } from 'zod';

import { type Cradle, createAppContainer } from '~/Infrastructure/Framework/container';

/** `node:util` parseArgs over process.argv that prints usage instead of a stack trace on bad flags. */
export function parseCliArgs<const Config extends Omit<ParseArgsConfig, 'args'>>(config: Config, usage: string) {
  try {
    return parseArgs(config);
  } catch (error) {
    console.error(`Usage: ${usage}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/** Parse raw argv-derived values through a use case's Entrypoint schema, or print usage and exit. */
export function parseCliInput<Schema extends z.ZodType>(schema: Schema, raw: unknown, usage: string): z.output<Schema> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    console.error(`Usage: ${usage}`);
    console.error(z.prettifyError(parsed.error));
    process.exit(1);
  }
  return parsed.data;
}

/** Build the container, run the task, print its result as JSON, and always dispose. */
export async function runCli(task: (container: AwilixContainer<Cradle>) => Promise<unknown>): Promise<void> {
  const container = createAppContainer();
  try {
    const result = await task(container);
    if (result !== undefined) console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    container.resolve('logger').error(message, 'CLI');
    process.exitCode = 1;
  } finally {
    await container.dispose();
  }
}
