import Link from 'next/link';
import { ArrowRight, BookOpen, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { IllustrationIcon } from '../components/IllustrationIcon';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { CollectionCard } from '../components/CollectionCard';
import { PuzzleCard } from '../components/PuzzleCard';
import { collections, featuredPuzzles, heroPuzzle } from '../../content/collections';
import { MyCollection } from '../components/MyCollection';

export function HomePage() {
  return <div className="site-page storybook-home">
    <SiteHeader active="home"/>
    <main id="main-content">
      <section className="storybook-hero" aria-labelledby="hero-title">
        <div className="storybook-hero-copy">
          <p className="storybook-kicker"><Sparkles size={18} aria-hidden/> A little world of wonder</p>
          <h1 id="hero-title">Free jigsaw puzzles<br/><em>for kids.</em></h1>
          <p className="storybook-lead">Little pieces. Big adventures. Play online with 4, 9 or 25 pieces.</p>
          <Link href="/puzzles/" className="story-button story-button--primary storybook-cta">Let's play <ArrowRight size={22} aria-hidden/></Link>
          <p className="storybook-note">Always free. No ads. No accounts.</p>
        </div>
        <figure className="storybook-hero-art">
          <div className="storybook-art-frame"><img src={heroPuzzle.image} alt="Forest Friends puzzle illustration" width={640} height={640} fetchPriority="high" decoding="async"/></div>
          <IllustrationIcon name="glowing-star" decorative size={46} className="storybook-art-star"/>
          <figcaption><BookOpen size={16} aria-hidden/> From the Animal Friends collection</figcaption>
        </figure>
      </section>
      <section className="storybook-section" aria-labelledby="collections-title">
        <div className="storybook-section-heading"><div><p className="storybook-kicker">Find your little world</p><h2 id="collections-title">Pick your adventure</h2></div></div>
        <div className="storybook-collection-grid">{collections.map(collection => <CollectionCard key={collection.slug} collection={collection}/>)}</div>
      </section>
      <section className="storybook-section" aria-labelledby="featured-title">
        <div className="storybook-section-heading"><div><p className="storybook-kicker">A few of our favourites</p><h2 id="featured-title">Ready to play?</h2></div><Link href="/puzzles/" className="storybook-text-link">All puzzles <ArrowRight size={19} aria-hidden/></Link></div>
        <div className="storybook-featured-grid">{featuredPuzzles.map(puzzle => <PuzzleCard key={puzzle.id} puzzle={puzzle}/>)}</div>
      </section>
      <MyCollection/>
      <section className="storybook-parent-note" aria-labelledby="parent-note-title">
        <ShieldCheck size={35} aria-hidden/>
        <div><h2 id="parent-note-title">A gentle place to play</h2><p>No timers, no pressure. Just pictures, patience and a little joy.</p></div>
        <Link className="storybook-text-link" href="/parents/">For grown-ups <Heart size={18} aria-hidden/></Link>
      </section>
    </main>
    <SiteFooter/>
  </div>;
}
