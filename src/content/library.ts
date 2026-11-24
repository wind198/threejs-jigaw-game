import type { Puzzle } from './puzzles';
export const LIBRARY_PAGE_SIZE = 20;
export type LibraryFilter = 'all' | 'new' | 'completed';
export type ArtworkFilter = 'all' | 'easy' | 'medium' | 'hard';
export function filterLibrary(puzzles: readonly Puzzle[], completed: ReadonlySet<string>, status: LibraryFilter, complexity: ArtworkFilter, query: string): Puzzle[] {
  const term = query.trim().toLowerCase();
  return puzzles.filter(puzzle =>
    (status === 'all' || (status === 'completed' ? completed.has(puzzle.id) : !completed.has(puzzle.id))) &&
    (complexity === 'all' || puzzle.artworkComplexity === complexity) &&
    (!term || (puzzle.title + ' ' + puzzle.category).toLowerCase().includes(term))
  );
}
export function visibleLibrary(puzzles: readonly Puzzle[], count: number): Puzzle[] {
  return puzzles.slice(0, Math.max(0, count));
}
