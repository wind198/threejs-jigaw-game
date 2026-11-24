import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { Puzzle } from '../../content/puzzles';
export function PuzzleCard({ puzzle, completed = false }: { puzzle: Puzzle; completed?: boolean }) {
  return <Link href={'/play/' + puzzle.id + '/'} prefetch={false} className="storybook-puzzle-card">
    <div className="puzzle-card-art">
      <img src={puzzle.image} width={320} height={320} loading="lazy" decoding="async" alt=""/>
      {completed && <span className="puzzle-card-completed"><Check size={16} aria-hidden/><span>Completed</span></span>}
    </div>
    <div className="storybook-puzzle-caption"><div><strong>{puzzle.title}</strong><small>{puzzle.category}</small></div><ArrowRight size={19} aria-hidden/></div>
  </Link>;
}
