import Link from 'next/link';
import { LayoutGrid, RefreshCcw, Puzzle } from 'lucide-react';
import { IllustrationIcon } from './IllustrationIcon';
type Props={kind:'loading'|'error'|'not-found';onRetry?:()=>void;embedded?:boolean};
export function StatusScreen({kind,onRetry,embedded=false}:Props){
 const loading=kind==='loading';
 const content=<section className="status-card" role={loading?'status':kind==='error'?'alert':undefined} aria-busy={loading}>
   <div className={'status-art status-art--'+kind} aria-hidden="true">
     <IllustrationIcon name={loading?'fox':kind==='error'?'teddy-bear':'rabbit'} size={112} decorative/>
     <Puzzle className="status-puzzle-icon" size={44} strokeWidth={1.8}/>
   </div>
   <h1>{loading?'Almost ready!':kind==='error'?'Oops!':'Lost a piece?'}</h1>
   <p>{loading?'Getting your puzzle ready.':kind==='error'?'This puzzle could not load.':'We could not find this picture.'}</p>
   {loading?<div className="status-loading-track" aria-hidden="true"><span/></div>:<div className="status-actions">
     {onRetry&&<button type="button" className="status-action status-action--primary" onClick={onRetry} aria-label="Try loading again"><RefreshCcw size={40} aria-hidden/><span>Try again</span></button>}
     <Link className={'status-action '+(!onRetry?'status-action--primary':'')} href="/puzzles/" aria-label="Browse puzzle pictures"><LayoutGrid size={40} aria-hidden/><span>Pictures</span></Link>
   </div>}
 </section>;
 return embedded?<div className="status-screen status-screen--embedded">{content}</div>:<main className="status-screen">{content}</main>;
}
