'use client';
import Link from 'next/link';
import { Modal } from '../design-system/Modal';
import { StoryButton } from './StoryButton';
export function LeaveDialog({onStay}:{onStay:()=>void}) {
  return <Modal labelledBy="leave-title" describedBy="leave-description" className="leave-dialog" onDismiss={onStay}>
    <h2 id="leave-title">Leave this puzzle?</h2>
    <p id="leave-description">Your placed pieces won't be saved.</p>
    <StoryButton className="dialog-primary" onClick={onStay}>Keep playing</StoryButton>
    <Link className="story-button story-button--secondary dialog-primary" href="/puzzles/">Choose another picture</Link>
  </Modal>;
}
