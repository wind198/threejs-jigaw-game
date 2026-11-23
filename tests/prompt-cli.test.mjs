import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadCatalog, categoriesOf } from '../scripts/prompt-cli/catalog.ts';
import { composePrompt, validateLibrarySources } from '../scripts/prompt-cli/composer.ts';
import { writePrompts } from '../scripts/prompt-cli/writer.ts';

test('catalog discovers unique themes, matching paths and all categories', async () => {
  const catalog = await loadCatalog();
  assert.equal(catalog.length, 8);
  assert.deepEqual(categoriesOf(catalog), ['animals', 'nature', 'space', 'vehicles']);
  assert.equal(new Set(catalog.map(theme => theme.id)).size, catalog.length);
  await validateLibrarySources();
});

test('a generated image prompt is deterministic and fully self-contained', async () => {
  const theme = (await loadCatalog()).find(item => item.id === 'forest-friends');
  assert.ok(theme);
  const first = await composePrompt(theme);
  const second = await composePrompt(theme);
  assert.equal(first.content, second.content);
  assert.equal(first.hash, second.hash);
  assert.match(first.content, /1:1/);
  assert.match(first.content, /#F7EEE3/);
  assert.match(first.content, /friendly fox/);
  assert.match(first.content, /Artwork complexity: EASY/);
  assert.doesNotMatch(first.content, /\{\{|prompts\/puzzle-art\//);
  const hard = await composePrompt(theme, 'hard');
  assert.match(hard.content, /Artwork complexity: HARD/);
  assert.notEqual(hard.hash, first.hash);
});

test('writer composes batches, merges manifest, and prevents accidental overwrites', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'little-jigsaw-prompt-'));
  try {
    const catalog = await loadCatalog();
    const first = await composePrompt(catalog.find(item => item.id === 'forest-friends'));
    const second = await composePrompt(catalog.find(item => item.id === 'happy-garden'));
    const paths = await writePrompts([first], dir);
    assert.equal(paths.length, 1);
    assert.equal(await readFile(paths[0], 'utf8'), first.content);
    await assert.rejects(() => writePrompts([first, second], dir), /Already exists/);
    await assert.rejects(() => access(join(dir, 'nature', 'happy-garden--easy.txt')));
    await writePrompts([second], dir);
    let manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.prompts.length, 2);
    assert.equal(manifest.prompts.find(item => item.id === 'forest-friends').sha256, first.hash);
    await writePrompts([first], dir, true);
    manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.prompts.length, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
