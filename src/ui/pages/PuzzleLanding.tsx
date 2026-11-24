import Link from 'next/link';
import { collections } from '../../content/collections';
import type { Puzzle } from '../../content/puzzles';
import { puzzleTitle,puzzleDescription,relatedPuzzles } from '../../seo/catalog';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { PuzzleCard } from '../components/PuzzleCard';
import { PlayEntry } from '../features/play/PlayEntry';
export function PuzzleLanding({puzzle}:{puzzle:Puzzle}){
 const collection=collections.find(c=>c.category===puzzle.category)!;
 return <PlayEntry key={puzzle.id} puzzle={puzzle}>
   <div className="site-page puzzle-landing">
    <SiteHeader active="puzzles"/>
    <main id="main-content">
      <nav aria-label="Breadcrumb" className="puzzle-breadcrumb"><Link href="/">Home</Link><span aria-hidden> / </span><Link href="/puzzles/">Puzzles</Link><span aria-hidden> / </span><Link href={'/puzzles/'+collection.slug+'/'}>{collection.category}</Link></nav>
      <section className="puzzle-intro">
        <img className="puzzle-intro-art" src={puzzle.image} alt={puzzle.title+' jigsaw puzzle illustration'} width={640} height={640} fetchPriority="high"/>
        <div><h1>{puzzleTitle(puzzle)}</h1><p>{puzzleDescription(puzzle)}</p><p>Drag pieces into place, or tap a piece and then tap its spot. Play on your phone, tablet or computer.</p><button type="button" data-play-entry className="story-button story-button--primary puzzle-play-button"><span aria-hidden="true"><svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor"><path d="M6 3v18l15-9z"/></svg></span>Play</button></div>
      </section>
      <section className="storybook-section"><h2>More {puzzle.category.toLowerCase()} jigsaw puzzles</h2><div className="storybook-featured-grid">{relatedPuzzles(puzzle).map(p=><PuzzleCard key={p.id} puzzle={p}/>)}</div><Link href={'/puzzles/'+collection.slug+'/'}>See all {collection.category.toLowerCase()} puzzles</Link></section>
    </main><SiteFooter/>
   </div>
 </PlayEntry>;
}
