import { readFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { themeMetadataSchema, type Theme } from './schema.ts';

export const DEFAULT_LIBRARY = fileURLToPath(new URL('../../prompts/puzzle-art/', import.meta.url));

export async function loadCatalog(libraryRoot = DEFAULT_LIBRARY): Promise<Theme[]> {
  const paths = (await fg('themes/**/*.md', { cwd: libraryRoot, onlyFiles: true })).sort();
  if (paths.length === 0) throw new Error('No theme files found in ' + libraryRoot);
  const ids = new Set<string>();
  const entries: Theme[] = [];
  for (const path of paths) {
    const raw = await readFile(resolve(libraryRoot, path), 'utf8');
    const parsed = matter(raw);
    const metadata = themeMetadataSchema.parse(parsed.data);
    const parts = path.split('/');
    if (parts.length !== 3 || parts[1] !== metadata.category || parts[2] !== metadata.id + '.md') {
      throw new Error('Theme path must match its category and id: ' + path);
    }
    if (ids.has(metadata.id)) throw new Error('Duplicate theme id: ' + metadata.id);
    ids.add(metadata.id);
    for (const heading of ['# Scene', '# Composition', '# Color direction']) {
      if (!parsed.content.includes(heading + '\n')) throw new Error(path + ' must include ' + heading);
    }
    if (!parsed.content.trim()) throw new Error('Empty theme content: ' + path);
    entries.push({ ...metadata, content: parsed.content.trim(), source: path });
  }
  return entries;
}

export function categoriesOf(themes: readonly Theme[]): string[] {
  return [...new Set(themes.map(theme => theme.category))].sort();
}
