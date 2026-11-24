'use client';
import { useIsClient, useLocalStorage } from 'usehooks-ts';
import { getPuzzle, type Puzzle } from '../../content/puzzles';
import { PuzzleCard } from './PuzzleCard';
export function MyCollection() {
  const client = useIsClient();
  const [ids] = useLocalStorage<string[]>('little-jigsaw:completed:v1', [], { initializeWithValue: false });
  const completed = client && Array.isArray(ids) ? [...new Set(ids)].reverse().map(getPuzzle).filter((p): p is Puzzle => Boolean(p)).slice(0, 4) : [];
  if (!completed.length) return null;
  return <section className="storybook-section" aria-labelledby="my-collection-title">
    <div className="storybook-section-heading"><div><p className="storybook-kicker">Your happy memories</p><h2 id="my-collection-title">My collection</h2></div></div>
    <div className="storybook-featured-grid">{completed.map(puzzle => <PuzzleCard key={puzzle.id} puzzle={puzzle}/>)}</div>
  </section>;
}
