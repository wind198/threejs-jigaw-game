import { generatedPuzzles } from "./generated/puzzle-manifest";
export type PuzzleCategory = 'Animals' | 'Nature' | 'Space' | 'Vehicles';
export interface Puzzle { id: string; title: string; category: PuzzleCategory; image: string; description: string; artworkComplexity?: 'easy' | 'medium' | 'hard' }
export const puzzles: readonly Puzzle[] = [
  { id: 'sunny-valley', title: 'Sunny Valley', category: 'Nature', image: '/assets/puzzles/sunny-valley.svg', description: 'A gentle valley full of sunshine' },
  { id: 'forest-friends', title: 'Forest Friends', category: 'Animals', image: '/assets/puzzles/forest-friends.svg', description: 'Meet our woodland friends' },
  { id: 'moon-adventure', title: 'Moon Adventure', category: 'Space', image: '/assets/puzzles/moon-adventure.svg', description: 'Explore the stars and planets' },
  ...generatedPuzzles,
];
export const categories = ['All', 'Animals', 'Nature', 'Space', 'Vehicles'] as const;
export function getPuzzle(id: string): Puzzle | undefined { return puzzles.find(p => p.id === id); }
export function nextPuzzle(id: string): Puzzle { const index = puzzles.findIndex(p => p.id === id); return puzzles[(index + 1) % puzzles.length]; }

/** Prefer an unplayed picture in the same collection, then any unplayed picture. */
export function recommendNextPuzzle(id: string, completed: readonly string[]): Puzzle {
  const current=getPuzzle(id),done=new Set([...completed,id]);
  const index=puzzles.findIndex(p=>p.id===id);
  const ordered=[...puzzles.slice(index+1),...puzzles.slice(0,index+1)];
  return ordered.find(p=>p.category===current?.category&&!done.has(p.id))
    ?? ordered.find(p=>!done.has(p.id))
    ?? nextPuzzle(id);
}
