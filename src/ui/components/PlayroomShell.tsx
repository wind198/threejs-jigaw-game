import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Puzzle } from '../../content/puzzles';

/** Static, meaningful playroom shell while the client game bundle initializes. */
export function PlayroomShell({puzzle,children}:{puzzle:Puzzle;children:ReactNode}){
 return <div className="playroom-entry">
   <div className="game-shell playroom playroom-entry-fallback">
     <header className="playroom-header">
       <Link href="/puzzles/" className="icon-button" aria-label="Back to puzzles"><ArrowLeft aria-hidden/></Link>
       <div className="playroom-heading"><h1>{puzzle.title}</h1></div>
     </header>
     <main className="playroom-workspace">
       <div className="playroom-stage">
         <div className="playroom-entry-board" role="status" aria-busy="true">
           <p>Getting your puzzle ready…</p>
         </div>
       </div>
     </main>
   </div>
   <div className="playroom-entry-content">{children}</div>
 </div>;
}
