'use client';
import { useEffect, useRef, type ReactNode } from 'react';

type Props = { children: ReactNode; labelledBy: string; describedBy?: string; className?: string; onDismiss: () => void };
/** Native modal dialog provides top-layer rendering, background inertness and focus containment. */
export function Modal({children,labelledBy,describedBy,className='',onDismiss}:Props) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const dialog=ref.current;
    if(!dialog)return;
    const previous=document.activeElement;
    dialog.showModal();
    return ()=>{
      if(dialog.open)dialog.close();
      if(previous instanceof HTMLElement && previous.isConnected)previous.focus();
    };
  },[]);
  return <dialog ref={ref} className={'storybook-dialog '+className} aria-labelledby={labelledBy} aria-describedby={describedBy}
    onCancel={event=>{event.preventDefault();onDismiss();}}>
    {children}
  </dialog>;
}
