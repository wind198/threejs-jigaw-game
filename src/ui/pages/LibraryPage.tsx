import Link from 'next/link';
import { Puzzle } from 'lucide-react';
import { puzzles, type PuzzleCategory } from '../../content/puzzles';
import { collections } from '../../content/collections';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
export function LibraryPage({ category = 'All' }: { category?: 'All' | PuzzleCategory }) {
  const matches = puzzles.filter(p => category === 'All' || p.category === category);
  const collection = collections.find(c => c.category === category);
  return <div className="site-page library-page">
    <SiteHeader active="puzzles"/>
    <main className="storybook-library-main">
      <div className="storybook-section-heading"><div><p className="storybook-kicker">Your next adventure</p><h1>{collection?.title ?? 'Choose a picture'}</h1></div></div>
      <p className="library-intro">{collection?.description ?? 'Which little world shall we put together today?'}</p>
      <nav className="category-tabs" aria-label="Puzzle collections">
        <Link href="/puzzles/" aria-current={category === 'All' ? 'page' : undefined} className={'category-tab' + (category === 'All' ? ' is-selected' : '')}>All</Link>
        {collections.map(c => <Link key={c.slug} href={'/puzzles/' + c.slug + '/'} aria-current={category === c.category ? 'page' : undefined} className={'category-tab' + (category === c.category ? ' is-selected' : '')}>{c.category}</Link>)}
      </nav>
      <div className="picture-grid library-grid">{matches.map(p => <Link key={p.id} className="picture-card" href={'/play/' + p.id + '/'}>
        <img src={p.image} alt="" loading="lazy" width={320} height={320}/><strong>{p.title}</strong><span><Puzzle size={14} aria-hidden/> Ready to play</span>
      </Link>)}</div>
      <p className="library-footnote">Every picture is free. Pick any adventure!</p>
    </main>
    <SiteFooter/>
  </div>;
}
