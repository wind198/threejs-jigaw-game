'use client';
import { useIsClient } from 'usehooks-ts';
import { SetupOverlay } from '../components/SetupOverlay';
import { useCompletedPuzzles } from '../../state/completed-puzzles';
import { nextPuzzle, type Puzzle } from '../../content/puzzles';
import { useGamePreferences } from '../../state/preferences';
import { JigsawGame } from '../JigsawGame';
export function GamePage({ puzzle }: { puzzle: Puzzle }) {
  const client = useIsClient();
  const { preferences, setPreferences } = useGamePreferences();
  const [completed, setCompleted] = useCompletedPuzzles();
  if (!client) return <main className="site-page" aria-busy="true"><h1>{puzzle.title}</h1><p>Getting your puzzle ready...</p></main>;
  if (!preferences.setupCompleted) return <main className="site-page"><h1>{puzzle.title}</h1><SetupOverlay onComplete={setPreferences}/></main>;
  return <JigsawGame key={puzzle.id + ':' + preferences.difficulty} puzzle={puzzle} preferences={preferences} onComplete={() => setCompleted(old => old.includes(puzzle.id) ? old : [...old, puzzle.id])} nextId={nextPuzzle(puzzle.id).id} completedCount={completed.length}/>;
}
