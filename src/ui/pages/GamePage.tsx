import { Link, useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { getPuzzle, nextPuzzle } from '../../content/puzzles';
import type { Preferences } from '../../state/preferences';
import { JigsawGame } from '../JigsawGame';
export function GamePage({ preferences }: { preferences: Preferences }) {
  const { puzzleId = '' } = useParams();
  const puzzle = getPuzzle(puzzleId);
  const [completed, setCompleted] = useLocalStorage<string[]>('little-jigsaw:completed:v1', []);
  if (!puzzle) return <main className="site-page not-found"><h1>Picture not found</h1><Link to="/puzzles">Return to pictures</Link></main>;
  return <JigsawGame key={puzzle.id + ':' + preferences.difficulty} puzzle={puzzle} preferences={preferences} onComplete={() => setCompleted(old => old.includes(puzzle.id) ? old : [...old, puzzle.id])} nextId={nextPuzzle(puzzle.id).id} completedCount={completed.length}/>;
}
