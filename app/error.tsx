'use client';
import { useEffect } from 'react';
import { FeedbackScreen } from '../src/ui/feedback/FeedbackScreen';
export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error('Page failed:',error);},[error]);
  return <FeedbackScreen kind="error" onRetry={reset}/>;
}
