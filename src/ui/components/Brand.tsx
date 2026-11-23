import Link from 'next/link';
import { Puzzle } from 'lucide-react';
export function Brand() {
  return <Link href="/" className="brand" aria-label="Little Jigsaw home">
    <span className="brand-icon"><Puzzle size={28} aria-hidden /></span>
    <span><span className="brand-overline">little moments</span><strong className="brand-name">Little Jigsaw <small>3D</small></strong></span>
  </Link>;
}
