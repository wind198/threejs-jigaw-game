import Link from 'next/link';
import { LayoutGrid, PawPrint, Leaf, Rocket, TrainFront } from 'lucide-react';
import { collections, requirePuzzle } from '../../content/collections';
import type { PuzzleCategory } from '../../content/puzzles';
const icons = { Animals: PawPrint, Nature: Leaf, Space: Rocket, Vehicles: TrainFront };
export function LibraryNavigation({ category }: { category: 'All' | PuzzleCategory }) {
  return <nav className="library-collections" aria-label="Puzzle collections">
    <Link href="/puzzles/" className="library-collection-link" aria-current={category === 'All' ? 'page' : undefined}>
      <span className="library-collection-all"><LayoutGrid size={28} aria-hidden/></span><span>All pictures</span>
    </Link>
    {collections.map(c => {
      const Icon = icons[c.category];
      return <Link key={c.slug} href={'/puzzles/' + c.slug + '/'} className="library-collection-link" aria-current={category === c.category ? 'page' : undefined}>
        <img src={requirePuzzle(c.coverId).image} width={64} height={64} alt="" decoding="async"/>
        <span><Icon size={15} aria-hidden/>{c.category}</span>
      </Link>;
    })}
  </nav>;
}
