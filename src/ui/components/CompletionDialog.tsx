'use client';
import Link from 'next/link';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import type { Puzzle } from '../../content/puzzles';
import { Modal } from '../design-system/Modal';
import { StoryButton } from './StoryButton';
import { IllustrationIcon } from './IllustrationIcon';
import { useRouter } from 'next/navigation';
export function CompletionDialog({puzzle,nextId,onReplay,animate}:{puzzle:Puzzle;nextId:string;onReplay:()=>void;animate:boolean}) {
  const router=useRouter();
  return <Modal labelledBy="complete-title" describedBy="complete-description" className={'completion-dialog'+(animate?' celebration-enabled':'')} onDismiss={()=>router.replace('/puzzles/')}>
    <div className="completion-celebration" aria-hidden="true">
      <IllustrationIcon name="star" size={30} decorative className="celebration-star-side"/>
      <IllustrationIcon name="glowing-star" size={64} decorative className="celebration-star-main"/>
      <IllustrationIcon name="star" size={30} decorative className="celebration-star-side"/>
    </div>
    <h2 id="complete-title">You did it!</h2>
    <p id="complete-description">A little masterpiece for your collection.</p>
    <figure className="completion-art"><img src={puzzle.image} alt={puzzle.title} width={320} height={320}/><figcaption>{puzzle.title}</figcaption></figure>
    <Link className="story-button story-button--primary dialog-primary" href={'/play/'+nextId+'/'}>Next puzzle <ArrowRight size={20} aria-hidden/></Link>
    <StoryButton tone="secondary" className="dialog-primary" onClick={onReplay}>Play again <RefreshCcw size={18} aria-hidden/></StoryButton>
    <Link className="dialog-back" href="/puzzles/">Back to pictures</Link>
  </Modal>;
}
