'use client';
import { useEffect } from 'react';
import { FeedbackScreen } from '../src/ui/feedback/FeedbackScreen';
import '../src/ui/design-system/tokens.css';
import '../src/ui/style.css';
import '../src/ui/styles/feedback.css';
export default function GlobalError({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error('Application failed:',error);},[error]);
  return <html lang="en"><body><FeedbackScreen kind="error" onRetry={reset}/></body></html>;
}
