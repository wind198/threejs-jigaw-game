#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { resolve } from 'node:path';
import { categoriesOf, loadCatalog } from './catalog.ts';
import { composePrompt, validateLibrarySources } from './composer.ts';
import { difficultySchema, type Difficulty } from './schema.ts';
import { writePrompts } from './writer.ts';
import { interactive } from './interactive.ts';

interface GenerateOptions { category?: string; all?: boolean; difficulty?: Difficulty; output: string; overwrite: boolean }

function parseDifficulty(value: string): Difficulty {
  const parsed = difficultySchema.safeParse(value);
  if (!parsed.success) throw new InvalidArgumentError('Expected easy, medium, or hard');
  return parsed.data;
}

async function generate(themeId: string | undefined, options: GenerateOptions): Promise<void> {
  const scopes = Number(Boolean(themeId)) + Number(Boolean(options.category)) + Number(Boolean(options.all));
  if (scopes !== 1) throw new Error('Choose exactly one scope: <theme>, --category <name>, or --all');
  const catalog = await loadCatalog();
  await validateLibrarySources();
  if (options.category && !categoriesOf(catalog).includes(options.category)) {
    throw new Error('Unknown category: ' + options.category);
  }
  const selected = catalog.filter(theme => (
    options.all || (options.category && theme.category === options.category) || (themeId && theme.id === themeId)
  ));
  if (selected.length === 0) throw new Error('Theme not found: ' + themeId);
  const composed = await Promise.all(selected.map(theme => composePrompt(theme, options.difficulty ?? theme.difficulty)));
  const written = await writePrompts(composed, resolve(options.output), options.overwrite);
  for (const path of written) console.log(path);
  console.log('Generated ' + written.length + ' self-contained prompt(s).');
}

const cli = new Command();
cli.name('puzzle-prompts').description('Compose repository-local image prompts for Little Jigsaw').version('1.0.0');

cli.command('list').description('List categories and themes').action(async () => {
  for (const category of categoriesOf(await loadCatalog())) {
    console.log(category + ':');
    const catalog = await loadCatalog();
    for (const theme of catalog.filter(item => item.category === category)) console.log('  ' + theme.id + ' (' + theme.difficulty + ')');
  }
});

cli.command('validate').description('Validate all theme metadata and shared sources').action(async () => {
  const catalog = await loadCatalog();
  await validateLibrarySources();
  for (const theme of catalog) await composePrompt(theme);
  console.log('Validated ' + catalog.length + ' theme(s) and all shared prompt sources.');
});

cli.command('generate')
  .description('Compose one theme, every theme in a category or the full library')
  .argument('[theme]', 'theme ID, e.g. forest-friends')
  .option('-c, --category <category>', 'generate every theme in a category')
  .option('-a, --all', 'generate every theme')
  .option('-d, --difficulty <level>', 'override artwork complexity: easy, medium or hard', parseDifficulty)
  .option('-o, --output <directory>', 'output directory', 'output/prompts')
  .option('--overwrite', 'replace previously generated prompts', false)
  .action(generate);

async function main() {
  try {
    if (process.argv.length <= 2) await interactive();
    else await cli.parseAsync(process.argv);
  } catch (error) {
    console.error('Error: ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
await main();
