import { puzzles, type PuzzleCategory } from '../../content/puzzles';
import { collections } from '../../content/collections';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { LibraryNavigation } from '../components/LibraryNavigation';
import { LibraryGrid } from '../features/library/LibraryGrid';
export function LibraryPage({ category = 'All' }: { category?: 'All' | PuzzleCategory }) {
  const matches = puzzles.filter(p => category === 'All' || p.category === category);
  const collection = collections.find(c => c.category === category);
  return <div className="site-page library-page storybook-library">
    <SiteHeader active="puzzles"/>
    <main className="storybook-library-main" id="main-content">
      <header className="library-heading"><p className="storybook-kicker">Your next adventure</p><h1>{collection ? collection.category + ' jigsaw puzzles' : 'Free online jigsaw puzzles'}</h1><p>{collection ? collection.title + ' — ' + collection.description : 'Choose a picture and play a free puzzle today.'}</p></header>
      <LibraryNavigation category={category}/>
      <LibraryGrid key={category} puzzles={matches}/>
    </main>
    <SiteFooter/>
  </div>;
}
