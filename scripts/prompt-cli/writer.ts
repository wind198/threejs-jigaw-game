import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ComposedPrompt } from './composer.ts';

export interface ManifestEntry {
  id: string;
  category: string;
  difficulty: string;
  path: string;
  sha256: string;
  sources: string[];
}
export interface PromptManifest {
  schemaVersion: 1;
  generatedAt: string;
  prompts: ManifestEntry[];
}

async function exists(path: string): Promise<boolean> {
  try { await stat(path); return true; } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

export async function writePrompts(prompts: readonly ComposedPrompt[], directory: string, overwrite = false): Promise<string[]> {
  if (!prompts.length) throw new Error('No prompts selected');
  const out = resolve(directory);
  const manifestPath = join(out, 'manifest.json');
  const targets = prompts.map(prompt => ({
    prompt,
    relativePath: prompt.theme.category + '/' + prompt.theme.id + '--' + prompt.difficulty + '.txt',
    target: join(out, prompt.theme.category, prompt.theme.id + '--' + prompt.difficulty + '.txt'),
  }));
  if (new Set(targets.map(item => item.target)).size !== targets.length) throw new Error('Duplicate output filenames');
  // Preflight before any write, so a batch never partially updates due to a known collision.
  if (!overwrite) for (const item of targets) {
    if (await exists(item.target)) throw new Error('Already exists: ' + item.target + ' (use --overwrite)');
  }

  let previous: PromptManifest | undefined;
  if (await exists(manifestPath)) {
    previous = JSON.parse(await readFile(manifestPath, 'utf8')) as PromptManifest;
    if (previous.schemaVersion !== 1 || !Array.isArray(previous.prompts)) throw new Error('Invalid existing manifest');
  }
  const replaced = new Set(targets.map(item => item.relativePath));
  const merged = [
    ...(previous?.prompts ?? []).filter(entry => !replaced.has(entry.path)),
    ...targets.map(({ prompt, relativePath }) => ({
      id: prompt.theme.id,
      category: prompt.theme.category,
      difficulty: prompt.difficulty,
      path: relativePath,
      sha256: prompt.hash,
      sources: prompt.sources,
    })),
  ].sort((a, b) => a.path.localeCompare(b.path));

  // Stage all new content first, then rename. No additional library runtime is needed.
  const staged: string[] = [];
  try {
    for (const item of targets) {
      await mkdir(dirname(item.target), { recursive: true });
      const temp = item.target + '.' + randomUUID() + '.tmp';
      await writeFile(temp, item.prompt.content, { flag: 'wx' });
      staged.push(temp);
    }
    await mkdir(out, { recursive: true });
    for (let index = 0; index < targets.length; index++) {
      await rename(staged[index], targets[index].target);
    }
    const manifest: PromptManifest = { schemaVersion: 1, generatedAt: new Date().toISOString(), prompts: merged };
    const tempManifest = manifestPath + '.' + randomUUID() + '.tmp';
    staged.push(tempManifest);
    await writeFile(tempManifest, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
    await rename(tempManifest, manifestPath);
  } finally {
    await Promise.all(staged.map(file => rm(file, { force: true })));
  }
  return targets.map(item => item.target);
}
