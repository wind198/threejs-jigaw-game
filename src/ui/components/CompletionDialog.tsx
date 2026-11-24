'use client';
import Link from 'next/link';
import { ArrowRight, RefreshCcw, LayoutGrid } from 'lucide-react';
import type { Puzzle } from '../../content/puzzles';
import { Modal } from '../design-system/Modal';
import { IllustrationIcon } from './IllustrationIcon';
import { useRouter } from 'next/navigation';

export function CompletionDialog({puzzle,nextId,onReplay,animate}:{puzzle:Puzzle;nextId:string;onReplay:()=>void;animate:boolean}) {
  const router=useRouter();
  return <Modal labelledBy="complete-title" className={'completion-dialog'+(animate?' celebration-enabled':'')} onDismiss={()=>router.replace('/puzzles/')}>
    <div className="completion-celebration" aria-hidden="true">
      <IllustrationIcon name="star" size={30} decorative className="celebration-star-side"/>
      <IllustrationIcon name="glowing-star" size={80} decorative className="celebration-star-main"/>
      <IllustrationIcon name="star" size={30} decorative className="celebration-star-side"/>
    </div>
    <h2 id="complete-title">Yay!<span className="sr-only"> Puzzle completed.</span></h2>
    <figure className="completion-art"><img src={puzzle.image} alt={puzzle.title+' completed puzzle'} width={320} height={320}/></figure>
    <div className="completion-actions" role="group" aria-label="Choose what to do next">
      <Link className="completion-action completion-action--library" href="/puzzles/" aria-label="Back to pictures">
        <LayoutGrid size={40} aria-hidden="true" strokeWidth={2.25}/><span>Pictures</span>
      </Link>
      <button type="button" className="completion-action completion-action--replay" onClick={onReplay} aria-label="Play this puzzle again">
        <RefreshCcw size={40} aria-hidden="true" strokeWidth={2.25}/><span>Again</span>
      </button>
      <Link className="completion-action completion-action--next" href={'/play/'+nextId+'/'} aria-label="Play next puzzle">
        <ArrowRight size={40} aria-hidden="true" strokeWidth={2.25}/><span>Next</span>
      </Link>
    </div>
  </Modal>;
}
