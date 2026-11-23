import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const names = ['fox', 'rabbit', 'teddy-bear', 'rocket', 'star', 'glowing-star', 'sunflower'];

test('all storybook illustration assets are committed as valid local SVGs', () => {
  for (const name of names) {
    const path = 'public/assets/illustrations/fluent/' + name + '.svg';
    assert.ok(existsSync(new URL(path, root)), path + ' missing');
    const content = read(path);
    assert.match(content, /<svg\b/);
    assert.match(content, /<\/svg>/);
    assert.doesNotMatch(content, /<script\b|onload\s*=/i);
  }
});

test('illustration license and provenance are bundled', () => {
  assert.match(read('public/assets/illustrations/fluent/LICENSE'), /MIT License/);
  assert.match(read('public/assets/illustrations/fluent/README.md'), /microsoft\/fluentui-emoji/);
});

test('storybook UI avoids OS-dependent emoji glyphs and uses local illustration component', () => {
  const paths = ['src/ui/pages/HomePage.tsx', 'src/ui/components/SetupOverlay.tsx', 'src/ui/JigsawGame.tsx'];
  for (const path of paths) {
    const content = read(path);
    assert.match(content, /IllustrationIcon/);
    assert.doesNotMatch(content, /[\u{1F300}-\u{1FAFF}]/u, path + ' still contains emoji');
  }
});
