import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Brand } from '../components/Brand';
import { StoryButton } from '../components/StoryButton';
import { puzzles } from '../../content/puzzles';
export function HomePage() {
  return <div className="site-page home-page">
    <header className="site-header"><Brand/><Link className="parent-link" to="/parents"><ShieldCheck size={19}/> For parents</Link></header>
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-cloud hero-cloud--one" aria-hidden>✿</div>
        <div className="hero-cloud hero-cloud--two" aria-hidden>✦</div>
        <div className="hero-mascot" aria-hidden>🦊 🌼 🐰</div>
        <p className="eyebrow"><Sparkles size={18}/> A little world of wonder</p>
        <h1 id="hero-title">Every piece is<br/><span>a little adventure.</span></h1>
        <p>Pick a picture, discover its pieces, and make something wonderful.</p>
        <Link to="/puzzles" className="story-button story-button--primary hero-cta">Let's Play! <ArrowRight size={22}/></Link>
        <span className="hero-note">Always free · No ads · No accounts</span>
      </section>
      <section className="home-gallery" aria-labelledby="gallery-title">
        <div className="section-heading"><div><span className="eyebrow">Explore together</span><h2 id="gallery-title">Choose your happy place</h2></div><Link to="/puzzles" className="text-link">All puzzles <ArrowRight size={18}/></Link></div>
        <div className="picture-grid">
          {puzzles.map(p => <Link key={p.id} to={'/play/' + p.id} className="picture-card">
            <img src={p.image} alt="" loading="lazy"/><strong>{p.title}</strong><span>{p.category}</span>
          </Link>)}
        </div>
      </section>
    </main>
    <footer className="site-footer"><span><Heart size={15}/> Made with love for little explorers</span><Link to="/parents">For Parents</Link></footer>
  </div>;
}
