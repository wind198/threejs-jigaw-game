import Link from 'next/link';
import { Compass, ShieldCheck } from 'lucide-react';
import { Brand } from './Brand';
export function SiteHeader({ active }: { active: 'home' | 'puzzles' }) {
  return <header className="storybook-header">
    <Brand/>
    <nav aria-label="Main navigation">
      <Link href="/puzzles/" aria-current={active === 'puzzles' ? 'page' : undefined}><Compass size={20} aria-hidden/> Explore</Link>
      <Link href="/parents/"><ShieldCheck size={20} aria-hidden/> For parents</Link>
    </nav>
  </header>;
}
