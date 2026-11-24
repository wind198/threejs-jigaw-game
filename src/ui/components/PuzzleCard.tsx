import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Puzzle } from '../../content/puzzles';
export function PuzzleCard({ puzzle }: { puzzle: Puzzle }) {
  return <Link href={'/play/' + puzzle.id + '/'} className="storybook-puzzle-card">
    <img src={puzzle.image} width={320} height={320} loading="lazy" decoding="async" alt=""/>
    <div className="storybook-puzzle-caption"><div><strong>{puzzle.title}</strong><small>{puzzle.category}</small></div><ArrowRight size={19} aria-hidden/></div>
  </Link>;
}
