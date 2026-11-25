'use client';
import { StatusScreen } from '../src/ui/components/StatusScreen';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <StatusScreen kind="error" onRetry={reset}/>;}
