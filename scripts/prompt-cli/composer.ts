import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { DEFAULT_LIBRARY } from './catalog.ts';
import { difficultySchema, type Difficulty, type Theme } from './schema.ts';

export const STANDARD_FILES = [
  'visual-style.md',
  'color-and-contrast.md',
  'composition.md',
  'puzzle-suitability.md',
  'negative-constraints.md',
] as const;

async function source(root: string, path: string): Promise<string> {
  const content = (await readFile(resolve(root, path), 'utf8')).trim();
  if (!content) throw new Error('Empty prompt source: ' + path);
  return content;
}

export async function validateLibrarySources(libraryRoot = DEFAULT_LIBRARY): Promise<void> {
  const paths = [
    'SYSTEM.md', 'templates/final-prompt.md',
    ...STANDARD_FILES.map(file => 'standards/' + file),
    ...difficultySchema.options.map(level => 'difficulty/' + level + '.md'),
  ];
  await Promise.all(paths.map(path => source(libraryRoot, path)));
  const template = await source(libraryRoot, 'templates/final-prompt.md');
  for (const token of ['SYSTEM', 'STANDARDS', 'DIFFICULTY', 'TITLE', 'CATEGORY', 'THEME']) {
    if (!template.includes('{{' + token + '}}')) throw new Error('Missing template token: ' + token);
  }
}

export interface ComposedPrompt {
  theme: Theme;
  difficulty: Difficulty;
  content: string;
  hash: string;
  sources: string[];
}

export async function composePrompt(theme: Theme, difficulty: Difficulty = theme.difficulty, libraryRoot = DEFAULT_LIBRARY): Promise<ComposedPrompt> {
  difficultySchema.parse(difficulty);
  const [system, template, difficultyContent, ...standards] = await Promise.all([
    source(libraryRoot, 'SYSTEM.md'),
    source(libraryRoot, 'templates/final-prompt.md'),
    source(libraryRoot, 'difficulty/' + difficulty + '.md'),
    ...STANDARD_FILES.map(file => source(libraryRoot, 'standards/' + file)),
  ]);
  const values: Record<string, string> = {
    SYSTEM: system,
    STANDARDS: standards.map((content, index) => '### ' + STANDARD_FILES[index].replace('.md', '').replaceAll('-', ' ') + '\n\n' + content).join('\n\n'),
    DIFFICULTY: difficultyContent,
    TITLE: theme.title,
    CATEGORY: theme.category,
    THEME: theme.content,
  };
  const content = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error('Unknown template token: ' + key);
    return values[key];
  }).trimEnd() + '\n';
  if (/\{\{[^{}]+\}\}/.test(content)) throw new Error('Unresolved template tokens');
  return {
    theme, difficulty, content,
    hash: createHash('sha256').update(content).digest('hex'),
    sources: ['SYSTEM.md', ...STANDARD_FILES.map(file => 'standards/' + file), 'difficulty/' + difficulty + '.md', theme.source, 'templates/final-prompt.md'],
  };
}
