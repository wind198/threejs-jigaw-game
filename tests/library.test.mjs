import test from 'node:test';
import assert from 'node:assert/strict';
import { puzzles } from '../src/content/puzzles.ts';
import { filterLibrary, visibleLibrary, LIBRARY_PAGE_SIZE } from '../src/content/library.ts';
import { normalizeCompleted } from '../src/state/completed-puzzles.ts';
test('library filters compose without mutating the input', () => {
  const completed = new Set(['animals-bunny-carrots']);
  assert.deepEqual(filterLibrary(puzzles, completed, 'completed', 'all', ' bunny ').map(p => p.id), ['animals-bunny-carrots']);
  assert.equal(filterLibrary(puzzles, completed, 'new', 'all', 'bunny').some(p => completed.has(p.id)), false);
  assert.ok(filterLibrary(puzzles, completed, 'all', 'hard', '').every(p => p.artworkComplexity === 'hard'));
  assert.equal(filterLibrary(puzzles, completed, 'all', 'all', '').length, puzzles.length);
});
test('progressive batches preserve order and end at catalog length', () => {
  assert.equal(visibleLibrary(puzzles, LIBRARY_PAGE_SIZE).length, LIBRARY_PAGE_SIZE);
  assert.deepEqual(visibleLibrary(puzzles, 2 * LIBRARY_PAGE_SIZE).slice(0, LIBRARY_PAGE_SIZE), visibleLibrary(puzzles, LIBRARY_PAGE_SIZE));
  assert.equal(visibleLibrary(puzzles, 1000).length, puzzles.length);
});
test('completion storage accepts legacy ids and rejects malformed records', () => {
  assert.deepEqual(normalizeCompleted(['forest-friends', null, 'forest-friends', 2, '']), ['forest-friends']);
  assert.deepEqual(normalizeCompleted({}), []);
});
