'use client';
import Link from 'next/link';
import { ArrowLeft, Home, Puzzle } from 'lucide-react';
import { puzzles, categories } from '../../content/puzzles';
import { useGameUI } from '../../state/game-ui';
export function LibraryPage() {
  const category = useGameUI(s => s.category);
  const setCategory = useGameUI(s => s.setCategory);
  const matches = puzzles.filter(p => category === 'All' || p.category === category);
  return <main className="site-page library-page">
    <header className="sub-header"><Link href="/" className="icon-button" aria-label="Back home"><ArrowLeft/></Link><div><span className="eyebrow">Your next adventure</span><h1>Choose a picture</h1></div><Link href="/" className="icon-button" aria-label="Home"><Home/></Link></header>
    <p className="library-intro">Which little world shall we put together today?</p>
    <div className="category-tabs" role="group" aria-label="Filter puzzles by category">{categories.map(c => <button key={c} className={'category-tab' + (category === c ? ' is-selected' : '')} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div className="picture-grid library-grid">
      {matches.map(p => <Link key={p.id} className="picture-card" href={'/play/' + p.id}>
        <img src={p.image} alt="" loading="lazy"/><strong>{p.title}</strong><span><Puzzle size={14}/> Ready to play</span>
      </Link>)}
    </div>
    <p className="library-footnote">Every picture is free. Pick any adventure!</p>
  </main>;
}
