'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, ExternalLink, Heart, Settings2, ShieldCheck } from 'lucide-react';
import { PIECES_PER_SIDE, type Difficulty, type Preferences } from '../../state/preferences';
import { StoryButton } from '../components/StoryButton';
export function ParentsPage({ preferences, onChange }: { preferences: Preferences; onChange: (p: Preferences) => void }) {
  const [verified, setVerified] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  return <main className="site-page parents-page">
    <header className="sub-header"><Link href="/" className="icon-button" aria-label="Home"><ArrowLeft/></Link><div><span className="eyebrow">A little space for grown-ups</span><h1>For Parents</h1></div><ShieldCheck size={29}/></header>
    {!verified ? <section className="parents-panel parent-gate">
      <ShieldCheck size={40}/><h2>Grown-ups only</h2>
      <p>This area contains settings and an external donation link. A simple reading challenge helps keep little explorers in the game; it is not age verification.</p>
      <form onSubmit={e => { e.preventDefault(); if (answer.trim().toLowerCase() === 'parent') { setVerified(true); setError(false); } else setError(true); }}>
        <label htmlFor="parent-answer">Type the word <strong>PARENT</strong> to continue</label>
        <input id="parent-answer" value={answer} autoComplete="off" onChange={e => setAnswer(e.target.value)} aria-invalid={error}/>
        {error && <p role="alert" className="field-error">Please enter the requested word.</p>}
        <StoryButton type="submit">Continue to parent settings</StoryButton>
      </form>
    </section> : <div className="parents-content">
      <section className="parents-panel"><h2><Settings2 size={23}/> Game Preferences</h2><p>Changes are saved on this device and apply when starting the next puzzle.</p>
        <label className="settings-field" htmlFor="difficulty">Puzzle size<select id="difficulty" value={preferences.difficulty} onChange={e => onChange({ ...preferences, difficulty: e.target.value as Difficulty })}>
          <option value="little">Little — {PIECES_PER_SIDE.little ** 2} pieces</option>
          <option value="growing">Growing — {PIECES_PER_SIDE.growing ** 2} pieces</option>
          <option value="explorer">Explorer — {PIECES_PER_SIDE.explorer ** 2} pieces</option>
        </select></label>
        {([['hintsEnabled', 'Show friendly hints'], ['soundEnabled', 'Enable all audio'], ['musicEnabled', 'Background music'], ['effectsEnabled', 'Sound effects'], ['animationsEnabled', 'Enable celebrations and motion']] as const).map(([key,label])=><label key={key} className="toggle-row"><input type="checkbox" checked={preferences[key]} onChange={e => onChange({ ...preferences, [key]:e.target.checked })}/>{label}</label>)}
        {([['musicVolume','Music volume'],['effectsVolume','Effects volume']] as const).map(([key,label])=><label key={key} className="settings-field">{label}<input type="range" min={0} max={1} step={.05} value={preferences[key]} onChange={e=>onChange({...preferences,[key]:Number(e.target.value)})}/></label>)}
      </section>
      <section className="parents-panel"><h2><Heart size={23}/> Keep Little Jigsaw free</h2><p>Every puzzle is free forever. If you enjoy our little project, adults can optionally support future artwork and improvements.</p>
        <a className="story-button story-button--secondary" href="https://www.buymeacoffee.com/" target="_blank" rel="noopener noreferrer"><Coffee size={18}/> About Buy Me a Coffee <ExternalLink size={16} aria-hidden/></a>
        <small className="muted">This is a placeholder, not a creator donation link. No payments are collected by the game.</small>
      </section>
      <section className="parents-panel"><h2><ShieldCheck size={23}/> Privacy & About</h2><p>No accounts, advertising, analytics, or backend. Game settings live in this browser's localStorage. Deleting site data removes them. All puzzle artwork is bundled with the website.</p><p>The Buy Me a Coffee link leads to a third-party website with its own privacy policy.</p></section>
    </div>}
  </main>;
}
