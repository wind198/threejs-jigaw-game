import test from 'node:test';
import assert from 'node:assert/strict';
import { collections, collectionPuzzles, requirePuzzle, featuredPuzzles, heroPuzzle } from '../src/content/collections.ts';
import { puzzles } from '../src/content/puzzles.ts';
test('collection links cover the full catalog and artwork belongs to its collection', () => {
  assert.equal(collections.length, 4);
  assert.equal(new Set(collections.map(c => c.slug)).size, 4);
  assert.equal(collections.flatMap(c => collectionPuzzles(c.category)).length, puzzles.length);
  for (const c of collections) assert.equal(requirePuzzle(c.coverId).category, c.category);
});
test('featured puzzles are curated across four categories with local AVIF covers', () => {
  assert.equal(new Set(featuredPuzzles.map(p => p.category)).size, 4);
  for (const p of [...featuredPuzzles, heroPuzzle]) assert.match(p.image, /\.avif$/);
});
