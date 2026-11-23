import * as p from '@clack/prompts';
import { resolve } from 'node:path';
import { categoriesOf, DEFAULT_LIBRARY, loadCatalog } from './catalog.ts';
import { composePrompt, validateLibrarySources } from './composer.ts';
import { difficultySchema, type Difficulty } from './schema.ts';
import { writePrompts } from './writer.ts';

function requireAnswer<T>(result: T | symbol): T {
  if (p.isCancel(result)) { p.cancel('Prompt generation cancelled.'); process.exit(0); }
  return result as T;
}

export async function interactive(): Promise<void> {
  p.intro('Little Jigsaw · Puzzle Artwork Prompts');
  const themes = await loadCatalog();
  await validateLibrarySources();
  const category = requireAnswer(await p.select({
    message: 'Choose a theme category',
    options: categoriesOf(themes).map(value => ({ value, label: value })),
  }));
  const scope = requireAnswer(await p.select({
    message: 'What would you like to generate?',
    options: [
      { value: 'one', label: 'One selected theme' },
      { value: 'category', label: 'Every theme in this category' },
    ],
  }));
  const available = themes.filter(theme => theme.category === category);
  const theme = scope === 'one' ? requireAnswer(await p.select({
    message: 'Choose a theme',
    options: available.map(item => ({ value: item.id, label: item.title })),
  })) : undefined;
  const difficulty = requireAnswer(await p.select({
    message: 'Choose artwork complexity',
    options: [
      { value: 'default', label: 'Use each theme\'s default complexity' },
      ...difficultySchema.options.map(value => ({ value, label: value })),
    ],
  }));
  const output = requireAnswer(await p.text({
    message: 'Output directory',
    initialValue: 'output/prompts',
    placeholder: 'output/prompts',
    validate: value => value?.trim() ? undefined : 'Output directory is required',
  }));
  const overwrite = requireAnswer(await p.confirm({ message: 'Replace existing prompt files if any?', initialValue: false }));
  const selected = available.filter(item => scope === 'category' || item.id === theme);
  p.note(selected.map(item => item.id + '--' + (difficulty === 'default' ? item.difficulty : difficulty) + '.txt').join('\n'), selected.length + ' file(s) selected');
  const confirmed = requireAnswer(await p.confirm({ message: 'Generate these self-contained prompts?', initialValue: true }));
  if (!confirmed) { p.cancel('No files generated.'); return; }
  const composed = await Promise.all(selected.map(item => composePrompt(item, difficulty === 'default' ? item.difficulty : difficulty as Difficulty, DEFAULT_LIBRARY)));
  const paths = await writePrompts(composed, resolve(String(output)), overwrite);
  p.outro('Generated ' + paths.length + ' prompt(s) in ' + resolve(String(output)));
}
