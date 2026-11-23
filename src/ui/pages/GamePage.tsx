'use client';
import Link from 'next/link';
import { useLocalStorage } from 'usehooks-ts';
import { nextPuzzle, type Puzzle } from '../../content/puzzles';
import { useGamePreferences } from '../../state/preferences';
import { JigsawGame } from '../JigsawGame';
export function GamePage({ puzzle }: { puzzle: Puzzle }) {
  const { preferences } = useGamePreferences();
  const [completed, setCompleted] = useLocalStorage<string[]>('little-jigsaw:completed:v1', []);
  return <JigsawGame key={puzzle.id + ':' + preferences.difficulty} puzzle={puzzle} preferences={preferences} onComplete={() => setCompleted(old => old.includes(puzzle.id) ? old : [...old, puzzle.id])} nextId={nextPuzzle(puzzle.id).id} completedCount={completed.length}/>;
}
