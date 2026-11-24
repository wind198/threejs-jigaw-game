'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Lightbulb, Volume2, VolumeX } from 'lucide-react';
import { ThreeApplication } from '@three-shell/core';
import { JigsawScene } from '../scene/jigsaw.scene';
import { JigsawSceneModule, JIGSAW_CONFIG, JIGSAW_CONTAINER, JIGSAW_PROGRESS, JIGSAW_COMPLETE } from '../scene/jigsaw.module';
import type { Puzzle } from '../content/puzzles';
import { PIECES_PER_SIDE, type Preferences } from '../state/preferences';
import { IconButton } from './design-system/IconButton';
import { StoryButton } from './components/StoryButton';
import { CompletionDialog } from './components/CompletionDialog';
import { LeaveDialog } from './components/LeaveDialog';
import { useGameAudio } from '../audio/audio.provider';
import { useGamePreferences } from '../state/preferences';
import { useMediaQuery } from 'usehooks-ts';

export function JigsawGame({ puzzle, preferences, onComplete, nextId }: { puzzle: Puzzle; preferences: Preferences; onComplete: () => void; nextId: string; completedCount: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [count,setCount] = useState(0);
  const [complete,setComplete] = useState(false);
  const [leaving,setLeaving] = useState(false);
  const reduceMotion=useMediaQuery('(prefers-reduced-motion: reduce)',{defaultValue:true,initializeWithValue:false});
  const animate=preferences.animationsEnabled&&!reduceMotion;
  const animateRef=useRef(animate);animateRef.current=animate;
  const [game,setGame] = useState(0);
  const [showHint,setShowHint] = useState(false);
  const muted = !preferences.soundEnabled;
  const {setPreferences}=useGamePreferences();
  const audio=useGameAudio();
  const audioRef=useRef(audio); audioRef.current=audio;
  const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
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
          {provide:JIGSAW_CONFIG,useValue:{size,image:puzzle.image,animationsEnabled:()=>animateRef.current,onError:fail}},
          {provide:JIGSAW_CONTAINER,useValue:element},
          {provide:JIGSAW_PROGRESS,useValue:(n:number)=>{if(cancelled)return;setCount(n);if(n>0)audioRef.current.snap(););}}},
          {provide:JIGSAW_COMPLETE,useValue:()=>{if(!cancelled){setComplete(true);audioRef.current.complete();callback.current();}}},
        ]);
        if(cancelled){await created.dispose();return;}
        runtime=created;created.start();setStatus('ready');
      }catch(error){fail(error);}
    })();
    return ()=>{cancelled=true;if(runtime)void runtime.dispose();};
  },[game,size,puzzle.image]);
  function restart(){audioRef.current.reset();setComplete(false);setCount(0);setShowHint(false);setStatus('loading');setGame(n=>n+1);}
  return <div className="game-shell playroom">
    <header className="playroom-header">
      <Link href="/puzzles/" className="icon-button" aria-label="Back to puzzles" onClick={e=>{if(count>0&&!complete){e.preventDefault();setLeaving(true);}}}><ArrowLeft aria-hidden/></Link>
      <div className="playroom-heading"><h1>{puzzle.title}</h1></div>
      <div className="playroom-actions">
        {preferences.hintsEnabled&&<IconButton aria-label={showHint?'Hide picture guide':'Show picture guide'} aria-pressed={showHint} onClick={()=>setShowHint(v=>!v)}><Lightbulb aria-hidden/></IconButton>}
        <IconButton aria-label={muted?'Unmute':'Mute'} aria-pressed={!muted} onClick={()=>setPreferences(old=>({...old,soundEnabled:!old.soundEnabled}))}>{muted?<VolumeX aria-hidden/>:<Volume2 aria-hidden/>}</IconButton>
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
    {leaving&&!complete&&<LeaveDialog onStay={()=>setLeaving(false)}/>}
    {complete&&<CompletionDialog puzzle={puzzle} nextId={nextId} onReplay={restart} animate={animate}/>}
  </div>;
}
