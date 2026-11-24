'use client';
import { useId, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PIECES_PER_SIDE, type Difficulty, type Preferences } from '../../state/preferences';
import { StoryButton } from './StoryButton';
import { IllustrationIcon, type IllustrationName } from './IllustrationIcon';
import { Modal } from '../design-system/Modal';

const choices: { id: Difficulty; illustration: IllustrationName; label: string }[] = [
  {id:'little',illustration:'teddy-bear',label:'Little'},
  {id:'growing',illustration:'fox',label:'Growing'},
  {id:'explorer',illustration:'rocket',label:'Explorer'},
];
export function SetupOverlay({ preferences, onComplete }: { preferences: Preferences; onComplete: (value: Preferences) => void }) {
  const [difficulty,setDifficulty]=useState<Difficulty>(preferences.difficulty);
  const router=useRouter(),groupId=useId();
  const leave=()=>router.replace('/puzzles/');
  return <Modal labelledBy="setup-title" describedBy="setup-description" className="first-play-dialog" onDismiss={leave}>
    <form onSubmit={event=>{event.preventDefault();onComplete({...preferences,setupCompleted:true,difficulty});}}>
      <p className="storybook-kicker">Your first adventure</p>
      <h2 id="setup-title">How many pieces?</h2>
      <p id="setup-description">Pick a size you feel happy with. You can change it later in For parents.</p>
      <fieldset className="first-play-options">
        <legend className="sr-only">Puzzle size</legend>
        {choices.map(choice=><label key={choice.id} className="first-play-choice">
          <input type="radio" name={groupId} value={choice.id} checked={difficulty===choice.id} onChange={()=>setDifficulty(choice.id)}/>
          <span className="first-play-tile">
            <IllustrationIcon name={choice.illustration} size={48} decorative/>
            <strong>{PIECES_PER_SIDE[choice.id]**2}</strong><span>pieces</span><small>{choice.label}</small>
          </span>
        </label>)}
      </fieldset>
      <StoryButton type="submit" className="dialog-primary">Let's play <ArrowRight size={20} aria-hidden/></StoryButton>
      <button className="dialog-back" type="button" onClick={leave}><ArrowLeft size={18} aria-hidden/> Choose another picture</button>
    </form>
  </Modal>;
}
