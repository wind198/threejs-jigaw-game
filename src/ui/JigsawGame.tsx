'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, X, Lightbulb, RefreshCcw, Volume2, VolumeX } from 'lucide-react';
import { ThreeApplication } from '@three-shell/core';
import { JigsawScene } from '../scene/jigsaw.scene';
import { JigsawSceneModule, JIGSAW_CONFIG, JIGSAW_CONTAINER, JIGSAW_PROGRESS, JIGSAW_COMPLETE } from '../scene/jigsaw.module';
import type { Puzzle } from '../content/puzzles';
import { PIECES_PER_SIDE, type Preferences } from '../state/preferences';
import { IconButton } from './design-system/IconButton';
import { StoryButton } from './components/StoryButton';
import { IllustrationIcon } from './components/IllustrationIcon';

export function JigsawGame({ puzzle, preferences, onComplete, nextId }: { puzzle: Puzzle; preferences: Preferences; onComplete: () => void; nextId: string; completedCount: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [count,setCount] = useState(0);
  const [complete,setComplete] = useState(false);
  const [game,setGame] = useState(0);
  const [showHint,setShowHint] = useState(false);
  const [muted,setMuted] = useState(!preferences.soundEnabled);
  const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
  const mutedRef = useRef(muted); mutedRef.current = muted;
  const callback = useRef(onComplete); callback.current = onComplete;
  const size = PIECES_PER_SIDE[preferences.difficulty], pieces = size * size;
  useEffect(() => {
    const element = host.current; if (!element) return;
    let cancelled = false;
    let runtime: ThreeApplication | null = null;
    setStatus('loading');
    const fail = (error:unknown) => { if (!cancelled) { console.error('Jigsaw failed:',error); setStatus('error'); } };
    void (async () => {
      try {
        const created = await ThreeApplication.create(JigsawSceneModule,JigsawScene,[
          {provide:JIGSAW_CONFIG,useValue:{size,image:puzzle.image,onError:fail}},
          {provide:JIGSAW_CONTAINER,useValue:element},
          {provide:JIGSAW_PROGRESS,useValue:(n:number)=>{if(cancelled)return;setCount(n);if(n>0&&!mutedRef.current){const sound=new Audio('/assets/audio/piece-snap.wav');sound.volume=.25;void sound.play().catch(()=>{});}}},
          {provide:JIGSAW_COMPLETE,useValue:()=>{if(!cancelled){setComplete(true);callback.current();}}},
        ]);
        if(cancelled){await created.dispose();return;}
        runtime=created;created.start();setStatus('ready');
      }catch(error){fail(error);}
    })();
    return ()=>{cancelled=true;if(runtime)void runtime.dispose();};
  },[game,size,puzzle.image]);
  function restart(){setComplete(false);setCount(0);setShowHint(false);setStatus('loading');setGame(n=>n+1);}
  return <div className="game-shell playroom">
    <header className="playroom-header">
      <Link href="/puzzles/" className="icon-button" aria-label="Back to puzzles" onClick={e=>{if(count>0&&!complete&&!window.confirm('Leave this puzzle? Placed pieces will not be saved.'))e.preventDefault();}}><ArrowLeft aria-hidden/></Link>
      <div className="playroom-heading"><h1>{puzzle.title}</h1></div>
      <div className="playroom-actions">
        {preferences.hintsEnabled&&<IconButton aria-label={showHint?'Hide picture guide':'Show picture guide'} aria-pressed={showHint} onClick={()=>setShowHint(v=>!v)}><Lightbulb aria-hidden/></IconButton>}
        <IconButton aria-label={muted?'Unmute':'Mute'} aria-pressed={!muted} onClick={()=>setMuted(v=>!v)}>{muted?<VolumeX aria-hidden/>:<Volume2 aria-hidden/>}</IconButton>
      </div>
    </header>
    <progress className="playroom-progress-line" value={count} max={pieces} aria-label="Puzzle progress"/>
    <main className="playroom-workspace">
      <div className="playroom-stage">
        <div className="scene" ref={host} aria-label="Puzzle board and piece trays"/>
        {status!=='ready'&&<div className="playroom-message" role={status==='error'?'alert':'status'}><h2>{status==='error'?'The puzzle needs a little help':'Getting your puzzle ready'}</h2>{status==='error'&&<><p>Try loading the puzzle again.</p><StoryButton onClick={restart}>Try again</StoryButton><Link href="/puzzles/">Choose another picture</Link></>}</div>}
      </div>
      {showHint&&<aside className="playroom-hint" aria-label="Picture guide"><img src={puzzle.image} alt={'Completed picture: '+puzzle.title} width={144} height={144}/><IconButton aria-label="Close picture guide" onClick={()=>setShowHint(false)}><X aria-hidden/></IconButton></aside>}
    </main>
    {complete&&<div className="modal-backdrop"><section className="modal-card complete-card" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <IllustrationIcon name="glowing-star" size={72} decorative className="complete-star"/><h2 id="complete-title">Hooray! You did it!</h2>
      <img className="complete-image" src={puzzle.image} alt={puzzle.title}/><p>You finished {puzzle.title}!</p>
      <Link className="story-button story-button--primary" href={'/play/'+nextId+'/'}>Next Puzzle <ArrowRight size={20}/></Link>
      <StoryButton tone="secondary" onClick={restart}>Play Again <RefreshCcw size={18}/></StoryButton>
      <Link className="text-link" href="/puzzles/">Back to pictures</Link>
    </section></div>}
  </div>;
}
