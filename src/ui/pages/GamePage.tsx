'use client';
import { useIsClient } from 'usehooks-ts';
import { SetupOverlay } from '../components/SetupOverlay';
import { useCompletedPuzzles } from '../../state/completed-puzzles';
import { recommendNextPuzzle, type Puzzle } from '../../content/puzzles';
import { useGamePreferences } from '../../state/preferences';
import { FeedbackScreen } from '../feedback/FeedbackScreen';
import { JigsawGame } from '../JigsawGame';
export function GamePage({ puzzle }: { puzzle: Puzzle }) {
  const client = useIsClient();
  const { preferences, setPreferences } = useGamePreferences();
  const [completed, setCompleted] = useCompletedPuzzles();
  if (!client) return <FeedbackScreen kind="loading"/>;
  if (!preferences.setupCompleted) return <main className="site-page"><h1>{puzzle.title}</h1><SetupOverlay preferences={preferences} onComplete={setPreferences}/></main>;
  return <JigsawGame key={puzzle.id + ':' + preferences.difficulty} puzzle={puzzle} preferences={preferences} onComplete={() => setCompleted(old => old.includes(puzzle.id) ? old : [...old, puzzle.id])} nextId={recommendNextPuzzle(puzzle.id,completed).id} completedCount={completed.length}/>;
}
