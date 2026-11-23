'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Lightbulb, RefreshCcw, Volume2, VolumeX } from 'lucide-react';
import { ThreeApplication } from '@three-shell/core';
import { JigsawScene } from '../scene/jigsaw.scene';
import { JigsawSceneModule, JIGSAW_CONFIG, JIGSAW_CONTAINER, JIGSAW_PROGRESS, JIGSAW_COMPLETE } from '../scene/jigsaw.module';
import type { Puzzle } from '../content/puzzles';
import { PIECES_PER_SIDE, type Preferences } from '../state/preferences';
import { StoryButton } from './components/StoryButton';
export function JigsawGame({ puzzle, preferences, onComplete, nextId }: { puzzle: Puzzle; preferences: Preferences; onComplete: () => void; nextId: string; completedCount: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [game, setGame] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [muted, setMuted] = useState(!preferences.soundEnabled);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const pieces = PIECES_PER_SIDE[preferences.difficulty] ** 2;
  useEffect(() => {
    const element = host.current; if (!element) return;
    let cancelled = false;
    let runtime: ThreeApplication | null = null;
    void (async () => {
      try {
        const created = await ThreeApplication.create(JigsawSceneModule, JigsawScene, [
          { provide: JIGSAW_CONFIG, useValue: { size: PIECES_PER_SIDE[preferences.difficulty], image: puzzle.image } },
          { provide: JIGSAW_CONTAINER, useValue: element },
          { provide: JIGSAW_PROGRESS, useValue: (n: number) => { setCount(n); if (n > 0 && !mutedRef.current) { const sound = new Audio('/assets/audio/piece-snap.wav'); sound.volume = .25; void sound.play().catch(() => {}); } } },
          { provide: JIGSAW_COMPLETE, useValue: () => { setComplete(true); callback.current(); } },
        ]);
        if (cancelled) { await created.dispose(); return; }
        runtime = created; created.start();
      } catch (error) { if (!cancelled) console.error('Jigsaw bootstrap failed:', error); }
    })();
    return () => { cancelled = true; if (runtime) void runtime.dispose(); };
  }, [game, preferences.difficulty, puzzle.image]);
  function restart() { setComplete(false); setCount(0); setShowHint(false); setGame(n => n + 1); }
  return <div className="game-shell">
    <header className="game-header">
      <Link href="/puzzles" className="icon-button" aria-label="Back to puzzles"><ArrowLeft/></Link>
      <div className="game-heading"><span className="eyebrow">A little adventure</span><h1>{puzzle.title}</h1></div>
      <div className="game-actions">
        {preferences.hintsEnabled && <button className="icon-button" title="Picture hint" aria-label={showHint ? 'Hide picture hint' : 'Show picture hint'} aria-pressed={showHint} onClick={() => setShowHint(v => !v)}><Lightbulb/></button>}
        <button className="icon-button" title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(v => !v)}>{muted ? <VolumeX/> : <Volume2/>}</button>
        <button className="icon-button" title="Restart puzzle" aria-label="Restart puzzle" onClick={restart}><RefreshCcw/></button>
      </div>
    </header>
    <main className="game-stage">
      <div className="scene" ref={host}/>
      {showHint && <div className="hint-preview"><img src={puzzle.image} alt={'Completed picture: ' + puzzle.title}/><span>Find this picture!</span></div>}
      <div className="game-progress" aria-live="polite"><span>⭐ Your puzzle</span><strong>{count} / {pieces}</strong><div className="progress-track"><div style={{ width: (count / pieces * 100) + '%' }}/></div></div>
      {complete && <div className="modal-backdrop"><section className="modal-card complete-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
        <span className="complete-star" aria-hidden>🌟</span><h2 id="complete-title">Hooray! You did it!</h2>
        <img className="complete-image" src={puzzle.image} alt={puzzle.title}/>
        <p>You finished {puzzle.title}!</p>
        <Link className="story-button story-button--primary" href={'/play/' + nextId}>Next Puzzle <ArrowRight size={20}/></Link>
        <StoryButton tone="secondary" onClick={restart}>Play Again <RefreshCcw size={18}/></StoryButton>
        <Link className="text-link" href="/puzzles">Back to pictures</Link>
      </section></div>}
    </main>
    <footer className="game-footer"><span>✦ Pick up a piece and find its happy place.</span><span>Take your time — there is no timer!</span></footer>
  </div>;
}
