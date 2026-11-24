import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { puzzles, categories, getPuzzle, nextPuzzle } from '../src/content/puzzles.ts';
import { generatedPuzzles } from '../src/content/generated/puzzle-manifest.ts';
test('catalog covers every source AVIF exactly once with unique IDs', () => {
  const root = new URL('../src/assets/puzzle-images/', import.meta.url);
  const paths = readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory()).flatMap(e => readdirSync(new URL(e.name + '/', root)).filter(f => f.endsWith('.avif')).map(f => '/assets/puzzle-images/' + e.name + '/' + f));
  assert.deepEqual(generatedPuzzles.map(p => p.image).sort(), paths.sort());
  assert.equal(new Set(puzzles.map(p => p.id)).size, puzzles.length);
  assert.ok(categories.includes('Vehicles'));
  for (const p of generatedPuzzles) {
    assert.ok(['easy','medium','hard'].includes(p.artworkComplexity));
    assert.ok(categories.includes(p.category));
    assert.equal(getPuzzle(p.id), p);
    assert.ok(existsSync(new URL('../src' + p.image, import.meta.url)));
  }
  assert.equal(nextPuzzle(puzzles.at(-1).id), puzzles[0]);
  for (const id of ['sunny-valley','forest-friends','moon-adventure']) assert.ok(getPuzzle(id));
});
