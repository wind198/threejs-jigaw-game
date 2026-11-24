import Link from 'next/link';
import { Heart } from 'lucide-react';
export function SiteFooter() {
  return <footer className="storybook-footer"><span><Heart size={18} aria-hidden/> Made for little explorers</span><Link href="/parents/">For parents &amp; privacy</Link></footer>;
}
